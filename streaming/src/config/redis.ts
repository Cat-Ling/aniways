import { createClient } from 'redis';

export const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

export async function initRedis() {
  redisClient.on('error', err => {
    console.error('Redis Client Error', err);
  });

  redisClient.on('ready', () => {
    console.log('Redis client connected successfully');
  });

  await redisClient.connect();

  process.on('beforeExit', () => {
    if (redisClient.isOpen) {
      redisClient.quit();
      console.log('Redis client disconnected');
    }
  });
}
