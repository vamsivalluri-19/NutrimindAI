import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

let redisClient: any;

const useMockRedis = true; // Fallback to avoid dependency issues during local setup

class MockRedisClient {
  private cache: Map<string, string> = new Map();

  async connect() {
    console.log('Redis client: Connected to Local Mock Redis cache');
  }

  async get(key: string): Promise<string | null> {
    return this.cache.get(key) || null;
  }

  async set(key: string, value: string, options?: { EX?: number }) {
    this.cache.set(key, value);
    if (options?.EX) {
      setTimeout(() => {
        this.cache.delete(key);
      }, options.EX * 1000);
    }
    return 'OK';
  }

  async del(key: string) {
    this.cache.delete(key);
    return 1;
  }

  async quit() {
    this.cache.clear();
  }

  on(event: string, callback: Function) {
    // No-op for events
  }
}

if (useMockRedis || !process.env.REDIS_URL) {
  redisClient = new MockRedisClient();
} else {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL
    });

    redisClient.on('error', (err: any) => {
      console.warn('Redis Client Error, switching to mock backend:', err.message);
      redisClient = new MockRedisClient();
    });
  } catch (err) {
    console.warn('Could not initialize Redis client, using mock fallback:', err);
    redisClient = new MockRedisClient();
  }
}

export { redisClient };
