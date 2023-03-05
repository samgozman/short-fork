import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TightshortsRepository } from './tightshorts.repository';
import { TightshortsService } from './tightshorts.service';

@Module({
  imports: [],
  controllers: [],
  providers: [TightshortsRepository, TightshortsService, ConfigService],
  exports: [TightshortsService],
})
export class TightshortsModule {}
