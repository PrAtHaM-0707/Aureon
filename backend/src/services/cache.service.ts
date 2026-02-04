import getRedisClient from '../config/redis.js';
import logger from '../utils/logger.js';

class CacheService {
  private client = getRedisClient();
  private defaultTTL = 3600; // 1 hour

  async get<T>(key: string): Promise<T | null> {
    try {
      if (this.client.status !== 'ready') return null;
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error(`Cache Get Error: ${error}`);
      return null;
    }
  }

  async set(key: string, value: unknown, ttl: number = this.defaultTTL): Promise<void> {
    try {
      if (this.client.status !== 'ready') return;
      await this.client.set(key, JSON.stringify(value), 'EX', ttl);
    } catch (error) {
      logger.error(`Cache Set Error: ${error}`);
    }
  }

  async del(key: string): Promise<void> {
    try {
      if (this.client.status !== 'ready') return;
      await this.client.del(key);
    } catch (error) {
      logger.error(`Cache Delete Error: ${error}`);
    }
  }

  async flushPattern(pattern: string): Promise<void> {
    try {
      if (this.client.status !== 'ready') return;
      const stream = this.client.scanStream({ match: pattern, count: 100 });
      
      stream.on('data', (keys) => {
        if (keys.length) {
          const pipeline = this.client.pipeline();
          keys.forEach((key: string) => pipeline.del(key));
          pipeline.exec();
        }
      });
    } catch (error) {
      logger.error(`Cache Flush Error: ${error}`);
    }
  }
}

export const cacheService = new CacheService();
