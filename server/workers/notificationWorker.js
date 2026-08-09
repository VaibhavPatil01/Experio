import { Worker } from 'bullmq';
import { redisConnection } from '../configs/redis.js';
import { NOTIFICATION_QUEUE_NAME } from '../queues/notificationQueue.js';
import { createNotification, createNotificationsBatch } from '../repositories/notificationRepository.js';
import { QdrantRepository } from '../repositories/qdrantRepository.js';
import { emitNotificationToUser } from '../configs/socket.js';
import qdrantClient from '../configs/qdrant.js';
import { Post } from '../models/Post.js';
import User from '../models/User.js';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

export const initNotificationWorker = () => {
  const worker = new Worker(NOTIFICATION_QUEUE_NAME, async (job) => {
    logger.info(`[NotificationWorker] Processing job ${job.name}`, { jobId: job.id });

    if (job.name === 'process-social-notification') {
      await processSocialNotification(job.data);
    } else if (job.name === 'process-post-match') {
      await processPostMatch(job.data);
    } else {
      logger.warn(`[NotificationWorker] Unknown job name ${job.name}`);
    }
  }, {
    connection: redisConnection
  });

  worker.on('failed', (job, err) => {
    logger.error(`[NotificationWorker] Job ${job?.id} failed`, { error: err.message, stack: err.stack });
  });

  return worker;
};

async function processSocialNotification(payload) {
  const { eventId, actorUserId, targetEntityId, postId, commentId, replyId, replyToUserId, recipientId: explicitRecipientId } = payload;
  let recipientId = explicitRecipientId || null;
  let type = '';
  let entityType = '';

  // Determine recipient and type based on event details
  if (eventId.startsWith('like_')) {
    type = 'POST_LIKE';
    entityType = 'POST';
    if (!recipientId) {
      const post = await Post.findById(postId).select('userId');
      if (!post) return;
      recipientId = post.userId;
    }
  } else if (eventId.startsWith('dislike_')) {
    type = 'POST_DISLIKE';
    entityType = 'POST';
    if (!recipientId) {
      const post = await Post.findById(postId).select('userId');
      if (!post) return;
      recipientId = post.userId;
    }
  } else if (eventId.startsWith('comment_')) {
    type = 'POST_COMMENT';
    entityType = 'COMMENT';
    if (!recipientId) {
      const post = await Post.findById(postId).select('userId');
      if (!post) return;
      recipientId = post.userId;
    }
  } else if (eventId.startsWith('reply_')) {
    if (replyToUserId) {
      type = 'REPLY_REPLY';
      entityType = 'REPLY';
      recipientId = recipientId || replyToUserId;
    } else {
      type = 'COMMENT_REPLY';
      entityType = 'REPLY';
      if (!recipientId) {
        const post = await Post.findOne({ _id: postId, "comments._id": commentId }, { "comments.$": 1 });
        if (!post || post.comments.length === 0) return;
        recipientId = post.comments[0].userId;
      }
    }
  }

  if (!recipientId) {
    logger.warn('[NotificationWorker] Could not determine recipientId for payload', { payload });
    return;
  }

  // Prevent notifying oneself
  if (recipientId.toString() === actorUserId.toString()) {
    logger.info('[NotificationWorker] Skipping self-notification', { actorUserId });
    return;
  }

  const savedNotification = await createNotification({
    recipientId,
    actorId: actorUserId,
    type,
    entityType,
    entityId: targetEntityId,
    postId,
    commentId,
    parentCommentId: commentId,
    eventId
  });

  // Emit real-time notification to the connected user
  emitNotificationToUser(recipientId, savedNotification);
}

async function processPostMatch(payload) {
  const { postId, vector } = payload;
  const startTime = Date.now();

  const MIN_SCORE = 0.60;
  const MAX_SCORE = 0.75;
  const TARGET_PERCENTAGE = 50; 
  const qdrantThreshold = MIN_SCORE + (TARGET_PERCENTAGE / 100) * (MAX_SCORE - MIN_SCORE); // 0.675

  let offset = 0;
  const BATCH_SIZE = 500;
  let allMatches = [];
  
  try {
    // Paginate through matches. Cap at 1000 valid matches for optimization.
    const MAX_NOTIFICATIONS = 1000;

    while (true) {
      const searchParams = { must: [] };
      
      const response = await qdrantClient.search('users', {
          vector: vector,
          limit: BATCH_SIZE,
          offset: offset,
          filter: searchParams,
          with_payload: true,
          score_threshold: qdrantThreshold
      });
      
      allMatches = allMatches.concat(response);
      
      if (response.length < BATCH_SIZE || allMatches.length >= MAX_NOTIFICATIONS) {
        break; 
      }
      
      offset += BATCH_SIZE;
    }

    const qdrantLatency = Date.now() - startTime;
    
    const post = await Post.findById(postId).select('userId');
    const postAuthorId = post ? post.userId.toString() : null;

    const validMatches = allMatches
      .filter(m => m.score >= qdrantThreshold && m.payload?.mongoId !== postAuthorId)
      .slice(0, MAX_NOTIFICATIONS);

    logger.info(`[NotificationWorker] PostMatch stats`, {
      postId,
      qdrantLatencyMs: qdrantLatency,
      totalEvaluated: allMatches.length,
      aboveThreshold: validMatches.length,
      thresholdScoreUsed: qdrantThreshold
    });

    if (validMatches.length === 0) return;

    const notificationsToCreate = validMatches.map(match => {
      // Normalize score for UI
      const normalizedScore = (match.score - MIN_SCORE) / (MAX_SCORE - MIN_SCORE);
      const matchPercentage = Math.max(0, Math.min(100, Math.round(normalizedScore * 100)));

      return {
        recipientId: match.payload.mongoId,
        actorId: postAuthorId,
        type: 'POST_MATCH',
        entityType: 'POST',
        entityId: postId,
        postId: postId,
        similarityScore: matchPercentage,
        eventId: `match_${match.payload.mongoId}_${postId}`,
        metadata: { matchPercentage }
      };
    });

    const persistStartTime = Date.now();
    
    // Chunking the array to prevent Memory / MongoDB BSON limit errors
    const CHUNK_SIZE = 500;
    let savedTotal = 0;
    for (let i = 0; i < notificationsToCreate.length; i += CHUNK_SIZE) {
      const chunk = notificationsToCreate.slice(i, i + CHUNK_SIZE);
      const savedChunk = await createNotificationsBatch(chunk);
      savedTotal += savedChunk.length;

      // Yield event loop for websocket delivery
      setImmediate(() => {
        if (Array.isArray(savedChunk)) {
          savedChunk.forEach(n => emitNotificationToUser(n.recipientId, n));
        }
      });
    }
    
    logger.info(`[NotificationWorker] Created ${savedTotal} POST_MATCH notifications in chunks`, {
      postId,
      persistLatencyMs: Date.now() - persistStartTime
    });

  } catch (error) {
    logger.error(`[NotificationWorker] processPostMatch failed`, { error: error.message, postId });
    throw error;
  }
}
