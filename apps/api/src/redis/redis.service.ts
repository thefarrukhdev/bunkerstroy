import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { env } from '../config/env';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  private isConnected = false;
  private memoryFallback = new Map<string, { value: string; expiresAt: number }>();
  private cleanupInterval: NodeJS.Timeout | null = null;

  async onModuleInit() {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, item] of this.memoryFallback.entries()) {
        if (item.expiresAt && now > item.expiresAt) {
          this.memoryFallback.delete(key);
        }
      }
    }, 60000);

    try {
      this.client = new Redis(env.REDIS_URL, {
        lazyConnect: true,
        maxRetriesPerRequest: 1,
        connectTimeout: 3000,
        retryStrategy: (times) => {
          const delay = Math.min(times * 150, 3000);
          this.logger.debug(`Redis reconnection attempt #${times} (backoff ${delay}ms)`);
          return delay;
        }
      });

      this.client.on('connect', () => {
        this.isConnected = true;
        this.logger.log('✅ Connected to Redis successfully');
      });

      this.client.on('ready', () => {
        this.isConnected = true;
      });

      this.client.on('close', () => {
        this.isConnected = false;
      });

      this.client.on('end', () => {
        this.isConnected = false;
      });

      this.client.on('reconnecting', () => {
        this.isConnected = false;
      });

      this.client.on('error', (err) => {
        this.isConnected = false;
        this.logger.warn(`Redis connection warning: ${err.message}`);
      });

      await this.client.connect();
    } catch (err: any) {
      this.isConnected = false;
      this.logger.warn(`Redis connect init fallback to memory store: ${err?.message}`);
    }
  }

  async onModuleDestroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    if (this.client) {
      try {
        await this.client.quit();
      } catch {
        // ignore disconnect error
      }
    }
  }

  async get(key: string): Promise<string | null> {
    if (this.isConnected && this.client) {
      try {
        return await this.client.get(key);
      } catch (err: any) {
        this.logger.warn(`Redis get error for key ${key}: ${err.message}`);
      }
    }

    // Memory fallback
    const item = this.memoryFallback.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.memoryFallback.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (this.isConnected && this.client) {
      try {
        if (ttlSeconds && ttlSeconds > 0) {
          await this.client.set(key, value, 'EX', ttlSeconds);
        } else {
          await this.client.set(key, value);
        }
        return;
      } catch (err: any) {
        this.logger.warn(`Redis set error for key ${key}: ${err.message}`);
      }
    }

    // Memory fallback
    const expiresAt = ttlSeconds && ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : Infinity;
    this.memoryFallback.set(key, { value, expiresAt });
  }

  async del(key: string): Promise<void> {
    if (this.isConnected && this.client) {
      try {
        await this.client.del(key);
        return;
      } catch (err: any) {
        this.logger.warn(`Redis del error for key ${key}: ${err.message}`);
      }
    }
    this.memoryFallback.delete(key);
  }

  async exists(key: string): Promise<boolean> {
    const val = await this.get(key);
    return val !== null;
  }

  async setNx(key: string, value: string, ttlSeconds: number): Promise<boolean> {
    if (this.isConnected && this.client) {
      try {
        const result = await this.client.set(key, value, 'EX', ttlSeconds, 'NX');
        return result === 'OK';
      } catch (err: any) {
        this.logger.warn(`Redis setNx error for key ${key}: ${err.message}`);
      }
    }

    // Memory fallback atomic setNx
    const now = Date.now();
    const existing = this.memoryFallback.get(key);
    if (existing && now <= existing.expiresAt) {
      return false;
    }
    const expiresAt = ttlSeconds > 0 ? now + ttlSeconds * 1000 : Infinity;
    this.memoryFallback.set(key, { value, expiresAt });
    return true;
  }

  async ping(): Promise<boolean> {
    if (this.isConnected && this.client) {
      try {
        const res = await this.client.ping();
        return res === 'PONG';
      } catch {
        return false;
      }
    }
    return true;
  }

  async incr(key: string, ttlSeconds?: number): Promise<number> {
    if (this.isConnected && this.client) {
      try {
        const val = await this.client.incr(key);
        if (ttlSeconds) {
          const ttl = await this.client.ttl(key);
          if (ttl < 0) {
            await this.client.expire(key, ttlSeconds);
          }
        }
        return val;
      } catch (err: any) {
        this.logger.warn(`Redis incr error for key ${key}: ${err.message}`);
      }
    }

    // Memory fallback
    const item = this.memoryFallback.get(key);
    const now = Date.now();
    let currentVal = 0;
    if (item && now <= item.expiresAt) {
      currentVal = parseInt(item.value, 10) || 0;
    }
    const newVal = currentVal + 1;
    const expiresAt = ttlSeconds && ttlSeconds > 0 ? now + ttlSeconds * 1000 : (item ? item.expiresAt : Infinity);
    this.memoryFallback.set(key, { value: newVal.toString(), expiresAt });
    return newVal;
  }
}
