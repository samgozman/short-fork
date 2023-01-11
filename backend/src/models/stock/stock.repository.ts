import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { RedisStore } from 'cache-manager-redis-store';

@Injectable()
export class StockRepository {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: RedisStore) {}

  async addStock(stock: string): Promise<void> {
    return this.cacheManager.set(`stock:${stock}`, '', { ttl: 0 }, undefined);
  }

  async getStock(stock: string): Promise<string> {
    return this.cacheManager.get(`stock:${stock}`, undefined, undefined);
  }
}
