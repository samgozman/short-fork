import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisStore } from 'cache-manager-redis-store';
import type { ITightshorts } from './interfaces/tightshorts.interface';

@Injectable()
export class TightshortsRepository {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: RedisStore,
    @Inject(ConfigService) private configService: ConfigService,
  ) {}

  async get(stock: string): Promise<ITightshorts> {
    return this.cacheManager.get(
      `stock:${stock}:tightshorts`,
      undefined,
      undefined,
    );
  }

  async set(stock: string, data: ITightshorts): Promise<void> {
    return this.cacheManager.set(
      `stock:${stock}:tightshorts`,
      data,
      // TODO: Set TTL as end of day (or 1 hour before market close)
      { ttl: this.configService.get('TTL_SHORTSQUEEZE') },
      undefined,
    );
  }
}
