import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisStore } from 'cache-manager-redis-store';
import type { IBarchartFinancial } from './interfaces/financial.interface';

@Injectable()
export class BarchartRepository {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: RedisStore,
    @Inject(ConfigService) private configService: ConfigService,
  ) {}

  async getFinancial(stock: string): Promise<IBarchartFinancial> {
    return this.cacheManager.get(
      `stock:${stock}:barchart:financial`,
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
}
