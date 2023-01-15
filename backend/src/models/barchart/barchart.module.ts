import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BarchartRepository } from './barchart.repository';
import { BarchartService } from './barchart.service';

@Module({
  imports: [],
  controllers: [],
  providers: [BarchartRepository, BarchartService, ConfigService],
  exports: [BarchartService],
})
export class BarchartModule {}
