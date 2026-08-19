import { Queue } from 'bullmq';
import { redisConnection } from '../../../configs/redis.js';

export const NOTIFICATION_QUEUE_NAME = 'notification-queue';

export const notificationQueue = new Queue(NOTIFICATION_QUEUE_NAME, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: true, 
    removeOnFail: false, // Keep failed jobs for inspection
  }
});
