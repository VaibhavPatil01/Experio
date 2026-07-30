import { EventEmitter } from 'events';
import { syncQueue } from '../queues/syncQueue.js';

class AppEventBus extends EventEmitter {}
export const eventBus = new AppEventBus();

// Entity Sync Events
export const EVENTS = {
  POST_CREATED: 'post.created',
  POST_UPDATED: 'post.updated',
  POST_DELETED: 'post.deleted',
  USER_UPDATED: 'user.updated'
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
