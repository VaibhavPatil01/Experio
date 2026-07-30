import { Redis } from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const redisConfig = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  maxRetriesPerRequest: null, // Important for BullMQ
};

// Create a reusable Redis connection for BullMQ
export const redisConnection = new Redis(redisConfig.url, {
  maxRetriesPerRequest: null,
});

redisConnection.on('error', (err) => {
  console.error('[Redis] Connection Error:', err);
});

redisConnection.on('ready', () => {
  console.log('[Redis] Connected successfully');
});

export default redisConnection;
