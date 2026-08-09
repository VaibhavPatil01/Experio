import { Worker } from 'bullmq';
import { redisConnection } from '../configs/redis.js';
import { NOTIFICATION_QUEUE_NAME } from '../queues/notificationQueue.js';
import { createNotification, createNotificationsBatch } from '../repositories/notificationRepository.js';
import { QdrantRepository } from '../repositories/qdrantRepository.js';
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
  const { eventId, actorUserId, targetEntityId, postId, commentId, replyId, replyToUserId } = payload;
  let recipientId = null;
  let type = '';
  let entityType = '';

  // Determine recipient and type based on event details
  if (eventId.startsWith('like_')) {
    const post = await Post.findById(postId).select('userId');
    if (!post) return;
    recipientId = post.userId;
    type = 'POST_LIKE';
    entityType = 'POST';
  } else if (eventId.startsWith('dislike_')) {
    const post = await Post.findById(postId).select('userId');
    if (!post) return;
    recipientId = post.userId;
    type = 'POST_DISLIKE';
    entityType = 'POST';
  } else if (eventId.startsWith('comment_')) {
    const post = await Post.findById(postId).select('userId');
    if (!post) return;
    recipientId = post.userId;
    type = 'POST_COMMENT';
    entityType = 'COMMENT';
  } else if (eventId.startsWith('reply_')) {
    if (replyToUserId) {
      recipientId = replyToUserId;
      type = 'REPLY_REPLY';
      entityType = 'REPLY';
    } else {
      const post = await Post.findOne({ _id: postId, "comments._id": commentId }, { "comments.$": 1 });
      if (!post || post.comments.length === 0) return;
      recipientId = post.comments[0].userId;
      type = 'COMMENT_REPLY';
      entityType = 'REPLY';
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

  await createNotification({
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
    // Paginate through matches if the platform grows. For Qdrant search, we can use offset + limit.
    // In production with millions of users, we'd use Scroll API, but search with offset is fine for baseline.
    while (true) {
      const searchParams = {
          must: [],
      };
      
      // The qdrantClient.search accepts an offset parameter in modern versions
      const response = await qdrantClient.search('users', {
          vector: vector,
          limit: BATCH_SIZE,
          offset: offset,
          filter: searchParams,
          with_payload: true,
          score_threshold: qdrantThreshold
      });
      
      allMatches = allMatches.concat(response);
      
      if (response.length < BATCH_SIZE) {
        break; // Reached the end of matches meeting the threshold
      }
      
      offset += BATCH_SIZE;
    }

    const qdrantLatency = Date.now() - startTime;
    
    const post = await Post.findById(postId).select('userId');
    const postAuthorId = post ? post.userId.toString() : null;

    const validMatches = allMatches.filter(m => m.score >= qdrantThreshold && m.payload?.mongoId !== postAuthorId);

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
    await createNotificationsBatch(notificationsToCreate);
    
    logger.info(`[NotificationWorker] Created ${notificationsToCreate.length} POST_MATCH notifications`, {
      postId,
      persistLatencyMs: Date.now() - persistStartTime
    });
    
    // WebSockets delivery would be triggered here (e.g. emitToUser(recipientId, notification))

  } catch (error) {
    logger.error(`[NotificationWorker] processPostMatch failed`, { error: error.message, postId });
    throw error;
  }
}
