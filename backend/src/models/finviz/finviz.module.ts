import { FinvizService } from './finviz.service';
import { Module } from '@nestjs/common';
import { FinvizRepository } from './finviz.repository';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [],
  providers: [FinvizService, FinvizRepository, ConfigService],
  exports: [FinvizService],
})
export class FinvizModule {}
