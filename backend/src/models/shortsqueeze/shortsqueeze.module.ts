import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ShortsqueezeRepository } from './shortsqueeze.repository';
import { ShortsqueezeService } from './shortsqueeze.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ShortsqueezeRepository, ShortsqueezeService, ConfigService],
  exports: [ShortsqueezeService],
})
export class ShortsqueezeModule {}
