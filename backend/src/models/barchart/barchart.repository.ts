import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisStore } from 'cache-manager-redis-store';
import type { IBarchartFinancial } from './interfaces/financial.interface';
import type { IBarchartOverview } from './interfaces/overview.interface';

@Injectable()
export class BarchartRepository {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: RedisStore,
    @Inject(ConfigService) private configService: ConfigService,
  ) {}

  async getFinancial(stock: string): Promise<IBarchartFinancial | null> {
    return this.cacheManager.get(
      `stock:${stock}:barchart:financial`,
      undefined,
      undefined,
    );
  }

  async getOverview(stock: string): Promise<IBarchartOverview | null> {
    return this.cacheManager.get(
      `stock:${stock}:barchart:overview`,
      undefined,
      undefined,
    );
  }

  async setFinancial(stock: string, data: IBarchartFinancial): Promise<void> {
    return this.cacheManager.set(
      `stock:${stock}:barchart:financial`,
      data,
      { ttl: this.configService.get('TTL_BARCHART_FINANCIAL') },
      undefined,
    );
  }

  async setOverview(stock: string, data: IBarchartOverview): Promise<void> {
    return this.cacheManager.set(
      `stock:${stock}:barchart:overview`,
      data,
      { ttl: this.configService.get('TTL_BARCHART_OVERVIEW') },
      undefined,
    );
  }
}
