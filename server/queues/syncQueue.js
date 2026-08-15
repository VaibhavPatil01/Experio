import { Queue } from 'bullmq';
import { redisConnection } from '../configs/redis.js';

export const SYNC_QUEUE_NAME = 'embedding-sync-queue';

export const syncQueue = new Queue(SYNC_QUEUE_NAME, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 10000, // 10s, 20s, 40s
    },
    removeOnComplete: true, // Keep Redis clean
    removeOnFail: false, // Leave failed jobs for DLQ inspection
  }
});
