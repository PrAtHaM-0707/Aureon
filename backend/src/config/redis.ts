import Redis from 'ioredis';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

let redisClient: Redis | null = null;

const getRedisClient = (): Redis => {
  if (!redisClient) {
    let redisUrl = process.env.REDIS_URL!;
    
    if (redisUrl.includes('upstash.io') && redisUrl.startsWith('redis://')) {
      logger.info('🔒 Upgrading Upstash connection to TLS (rediss://)...');
      redisUrl = redisUrl.replace('redis://', 'rediss://');
    }

    logger.info(`🔌 Connecting to Redis at ${redisUrl}...`);
    
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 10,
      retryStrategy(times) {
        const delay = Math.min(times * 100, 3000);
        return delay;
      },
    });

    redisClient.on('connect', () => {
      logger.info('✅ Redis connected successfully');
    });

    redisClient.on('error', (err) => {
      logger.error(`❌ Redis connection error: ${err.message}`);
    });
  }
  return redisClient;
};

export default getRedisClient;
