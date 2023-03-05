import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisStore } from 'cache-manager-redis-store';
import type { IShortsqueeze } from './interfaces/shortsqueeze.interface';

@Injectable()
export class ShortsqueezeRepository {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: RedisStore,
    @Inject(ConfigService) private configService: ConfigService,
  ) {}

  async get(stock: string): Promise<IShortsqueeze> {
    return this.cacheManager.get(
      `stock:${stock}:shortsqueeze`,
      undefined,
      undefined,
    );
  }

  async set(stock: string, data: IShortsqueeze): Promise<void> {
    return this.cacheManager.set(
      `stock:${stock}:shortsqueeze`,
      data,
      { ttl: this.configService.get('TTL_SHORTSQUEEZE') },
      undefined,
    );
  }
}
