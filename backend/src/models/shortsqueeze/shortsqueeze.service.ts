import { Injectable } from '@nestjs/common';
import shortsqueeze from 'shortsqueeze';
import { ShortsqueezeRepository } from './shortsqueeze.repository';
import type { IShortsqueeze } from './interfaces/shortsqueeze.interface';

@Injectable()
export class ShortsqueezeService {
  constructor(private readonly squeezeRepository: ShortsqueezeRepository) {}

  async get(stockTicker: string): Promise<IShortsqueeze> {
    return this.squeezeRepository.get(stockTicker);
  }
  async set(stockTicker: string, data: IShortsqueeze): Promise<void> {
    return this.squeezeRepository.set(stockTicker, data);
  }

  async fetch(stockTicker: string): Promise<IShortsqueeze | null> {
    const squeeze = await shortsqueeze(stockTicker);
    if (!squeeze) {
      return null;
    }

    return {
      shortFlow: squeeze ? squeeze.shortPercentOfFloat : undefined,
    };
  }
}
