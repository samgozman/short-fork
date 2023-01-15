import { Injectable } from '@nestjs/common';
import { StockRepository } from './stock.repository';

@Injectable()
export class StockService {
  constructor(private readonly stockRepository: StockRepository) {}

  async set(stock: string): Promise<void> {
    return this.stockRepository.set(stock);
  }

  async get(stock: string): Promise<string> {
    return this.stockRepository.get(stock);
  }
}
