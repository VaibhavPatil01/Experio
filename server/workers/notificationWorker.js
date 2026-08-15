import { Worker } from 'bullmq';
import { redisConnection } from '../configs/redis.js';
import { NOTIFICATION_QUEUE_NAME } from '../queues/notificationQueue.js';
import { createNotification, createNotificationsBatch, deleteNotificationByEventId } from '../repositories/notificationRepository.js';
import { QdrantRepository } from '../repositories/qdrantRepository.js';
import { emitNotificationToUser, emitNotificationRemove } from '../configs/socket.js';
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
    logger.info(`[NotificationWorker] Job Started`, { 
      event: 'JOB_STARTED', 
      jobId: job.id, 
      jobName: job.name 
    });

    if (job.name === 'process-social-notification') {
      await processSocialNotification(job.data);
    } else if (job.name === 'process-post-match') {
      await processPostMatch(job.data);
    } else if (job.name === 'process-remove-notification') {
      await processRemoveNotification(job.data);
    } else {
      logger.warn(`[NotificationWorker] Unknown job name ${job.name}`);
    }
  }, {
    connection: redisConnection
  });

  worker.on('failed', (job, err) => {
    logger.error(`[NotificationWorker] Job Failed`, { 
      event: 'JOB_FAILED', 
      jobId: job?.id, 
      jobName: job?.name,
      errorCategory: 'QUEUE_ERROR',
      error: err.message, 
      stack: err.stack 
    });
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

  const startTime = Date.now();
  if (!recipientId) {
    logger.warn('[NotificationWorker] Could not determine recipientId for payload', { 
      event: 'VALIDATION_ERROR', 
      eventId 
    });
    return;
  }

  // Prevent notifying oneself
  if (recipientId.toString() === actorUserId.toString()) {
    logger.info('[NotificationWorker] Skipping self-notification', { event: 'NOTIFICATION_SKIPPED', actorUserId, eventId });
    return;
  }

  let savedNotification;
  try {
    const persistStartTime = Date.now();
    savedNotification = await createNotification({
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
    
    logger.info(`[NotificationWorker] Notification created`, {
      event: `${type}_CREATED`, // e.g. POST_COMMENT_CREATED, POST_LIKE_CREATED
      eventId,
      notificationId: savedNotification._id,
      userId: recipientId,
      persistLatencyMs: Date.now() - persistStartTime,
      totalLatencyMs: Date.now() - startTime
    });
  } catch (error) {
    logger.error(`[NotificationWorker] Database error creating notification`, {
      event: 'DATABASE_ERROR',
      eventId,
      error: error.message
    });
    throw error;
  }

  // Emit real-time notification to the connected user
  try {
    const wsStartTime = Date.now();
    await savedNotification.populate([
      { path: 'actorId', select: 'username profilePicture', model: 'User' },
      { path: 'postId', select: 'title company role isAnonymous userId', model: 'Post' }
    ]);
    
    if (savedNotification.postId && savedNotification.postId.isAnonymous && savedNotification.postId.userId) {
      if (savedNotification.actorId && savedNotification.actorId._id.toString() === savedNotification.postId.userId.toString()) {
        savedNotification.actorId.username = 'Anonymous User';
        savedNotification.actorId.profilePicture = null;
      }
    }
    
    emitNotificationToUser(recipientId, savedNotification);
    logger.info(`[NotificationWorker] Notification emitted via WebSocket`, {
      event: 'NOTIFICATION_DELIVERED',
      eventId,
      notificationId: savedNotification._id,
      userId: recipientId,
      wsLatencyMs: Date.now() - wsStartTime
    });
    
  } catch (error) {
    logger.error(`[NotificationWorker] Social notification error`, { error: error.message });
    throw error;
  }
}

async function processRemoveNotification(payload) {
  const { eventId } = payload;
  if (!eventId) return;
  try {
    const result = await deleteNotificationByEventId(eventId);
    if (result && result.recipientId) {
      logger.info(`[NotificationWorker] Deleted notification for event: ${eventId}`);
      emitNotificationRemove(result.recipientId.toString(), eventId);
    }
  } catch (error) {
    logger.error(`[NotificationWorker] Remove notification error`, { error: error.message });
    throw error;
  }
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

    const qdrantLatencyMs = Date.now() - startTime;
    
    const post = await Post.findById(postId).select('userId');
    const postAuthorId = post ? post.userId.toString() : null;

    const validMatches = allMatches
      .filter(m => m.score >= qdrantThreshold && m.payload?.mongoId !== postAuthorId)
      .slice(0, MAX_NOTIFICATIONS);

    logger.info(`[NotificationWorker] Profile match completed`, {
      event: 'PROFILE_MATCH_COMPLETED',
      postId,
      qdrantLatencyMs,
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
        try {
          if (Array.isArray(savedChunk)) {
            savedChunk.forEach(n => emitNotificationToUser(n.recipientId, n));
          }
        } catch (error) {
           logger.error(`[NotificationWorker] WebSocket chunk delivery failed`, {
             event: 'NOTIFICATION_DELIVERY_FAILED',
             postId,
             errorCategory: 'WEBSOCKET_ERROR',
             error: error.message
           });
        }
      });
    }
    
    logger.info(`[NotificationWorker] Match notifications created`, {
      event: 'NOTIFICATION_CREATED',
      postId,
      generatedCount: savedTotal,
      persistLatencyMs: Date.now() - persistStartTime,
      totalLatencyMs: Date.now() - startTime
    });

  } catch (error) {
    logger.error(`[NotificationWorker] processPostMatch failed`, { 
      event: 'JOB_FAILED',
      errorCategory: error.message.includes('Qdrant') ? 'QDRANT_ERROR' : 'DATABASE_ERROR',
      postId, 
      error: error.message 
    });
    throw error;
  }
}
