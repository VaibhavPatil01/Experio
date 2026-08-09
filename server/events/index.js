import { EventEmitter } from 'events';
import { syncQueue } from '../queues/syncQueue.js';

class AppEventBus extends EventEmitter {}
export const eventBus = new AppEventBus();

// Entity Sync Events
export const EVENTS = {
  POST_CREATED: 'post.created',
  POST_UPDATED: 'post.updated',
  POST_DELETED: 'post.deleted',
  USER_UPDATED: 'user.updated',
  
  // Notification Events
  POST_COMMENTED: 'post.commented',
  POST_LIKED: 'post.liked',
  POST_DISLIKED: 'post.disliked',
  COMMENT_REPLIED: 'comment.replied',
  REPLY_REPLIED: 'reply.replied',
  POST_MATCH_READY: 'post.match.ready'
};

eventBus.on(EVENTS.POST_CREATED, async (payload) => {
  await syncQueue.add('sync-post', { entityType: 'post', entityId: payload.postId });
});

eventBus.on(EVENTS.POST_UPDATED, async (payload) => {
  await syncQueue.add('sync-post', { entityType: 'post', entityId: payload.postId });
});

eventBus.on(EVENTS.USER_UPDATED, async (payload) => {
  await syncQueue.add('sync-user', { entityType: 'user', entityId: payload.userId });
});

eventBus.on(EVENTS.POST_DELETED, async (payload) => {
  // We can add a job to delete it from Qdrant as well, skipping for now to focus on upserts, 
  // but architecturally this is where it goes.
});

// Notification Handlers
const enqueueNotification = async (jobName, payload) => {
  try {
    // Import here to avoid circular dependencies if necessary, but ideally top level is fine.
    // We will dynamic import or ensure it is loaded.
    const { notificationQueue } = await import('../queues/notificationQueue.js');
    await notificationQueue.add(jobName, payload);
  } catch (error) {
    console.error(`Failed to enqueue notification event ${jobName}`, error);
  }
};

eventBus.on(EVENTS.POST_COMMENTED, (payload) => enqueueNotification('process-social-notification', payload));
eventBus.on(EVENTS.POST_LIKED, (payload) => enqueueNotification('process-social-notification', payload));
eventBus.on(EVENTS.POST_DISLIKED, (payload) => enqueueNotification('process-social-notification', payload));
eventBus.on(EVENTS.COMMENT_REPLIED, (payload) => enqueueNotification('process-social-notification', payload));
eventBus.on(EVENTS.REPLY_REPLIED, (payload) => enqueueNotification('process-social-notification', payload));
eventBus.on(EVENTS.POST_MATCH_READY, (payload) => enqueueNotification('process-post-match', payload));
