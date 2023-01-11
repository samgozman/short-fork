import { StockService } from './stock.service';
import { Module } from '@nestjs/common';
import { StockRepository } from './stock.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [StockService, StockRepository],
  exports: [StockService],
})
export class StockModule {}
