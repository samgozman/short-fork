import { Injectable } from '@nestjs/common';
import { StockRepository } from './stock.repository';

@Injectable()
export class StockService {
  constructor(private readonly stockRepository: StockRepository) {}

  async addStock(stock: string): Promise<void> {
    return this.stockRepository.addStock(stock);
  }

  async getStock(stock: string): Promise<string> {
    return this.stockRepository.getStock(stock);
  }
}
