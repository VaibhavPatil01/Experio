import { Worker } from 'bullmq';
import { redisConnection } from '../configs/redis.js';
import { NOTIFICATION_QUEUE_NAME } from '../queues/notificationQueue.js';
import { createNotification, createNotificationsBatch } from '../repositories/notificationRepository.js';
import { QdrantRepository } from '../repositories/qdrantRepository.js';
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

  // We search Qdrant for users whose profiles match the post's vector
  // QdrantRepository.searchUsers should return matches.
  // Using a score threshold of 0.50 as required. Limit to 1000 to prevent infinite massive arrays.
  const matches = await QdrantRepository.searchUsers(vector, 1000, {
      must: [],
      // Ensure we don't notify the author themselves (if we knew authorId, but we can filter later)
  });

  const post = await Post.findById(postId).select('userId');
  const postAuthorId = post ? post.userId.toString() : null;

  const validMatches = matches.filter(m => m.score >= 0.50 && m.payload?.mongoId !== postAuthorId);

  if (validMatches.length === 0) {
    logger.info('[NotificationWorker] No users matched post above 50% threshold', { postId });
    return;
  }

  logger.info(`[NotificationWorker] Found ${validMatches.length} users matching post ${postId}`);

  const notificationsToCreate = validMatches.map(match => ({
    recipientId: match.payload.mongoId,
    actorId: postAuthorId, // System or author generated
    type: 'POST_MATCH',
    entityType: 'POST',
    entityId: postId,
    postId: postId,
    similarityScore: Math.round(match.score * 100),
    eventId: `match_${match.payload.mongoId}_${postId}`
  }));

  // Batch insert
  await createNotificationsBatch(notificationsToCreate);
}
