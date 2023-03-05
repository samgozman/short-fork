import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisStore } from 'cache-manager-redis-store';
import type { IFinviz } from './interfaces/finviz.interface';

@Injectable()
export class FinvizRepository {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: RedisStore,
    @Inject(ConfigService) private configService: ConfigService,
  ) {}

  async get(stock: string): Promise<IFinviz | null> {
    return this.cacheManager.get(`stock:${stock}:finviz`, undefined, undefined);
  }

  async set(stock: string, data: IFinviz): Promise<void> {
    return this.cacheManager.set(
      `stock:${stock}:finviz`,
      data,
      { ttl: this.configService.get('TTL_FINVIZ') },
      undefined,
    );
  }
}
