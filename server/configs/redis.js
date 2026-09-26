import { Redis } from 'ioredis';
import dotenv from 'dotenv';
dotenv.config({ quiet: true });

// Suppress annoying BullMQ eviction policy warning(Removed annoying bullmq eviction warning)
const originalWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('IMPORTANT! Eviction policy is')) return;
  originalWarn(...args);
};

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
