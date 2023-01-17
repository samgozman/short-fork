import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { RedisStore } from 'cache-manager-redis-store';
import type { ITightshorts } from './interfaces/tightshorts.interface';

@Injectable()
export class TightshortsRepository {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: RedisStore) {}

  async get(stock: string): Promise<ITightshorts> {
    return this.cacheManager.get(
      `stock:${stock}:tightshorts`,
      undefined,
      undefined,
    );
  }

  async set(stock: string, data: ITightshorts): Promise<void> {
    // Note: assuming server in UTC 0 timezone. Don't want to use extra library
    const endOfDay = new Date().setHours(23, 59, 59, 999);

    return this.cacheManager.set(
      `stock:${stock}:tightshorts`,
      data,
      // Note: valid until end of day (seconds, integer)
      { ttl: ~~((endOfDay - Date.now()) / 1000) },
      undefined,
    );
  }
}
