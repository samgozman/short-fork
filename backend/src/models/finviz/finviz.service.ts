import { Injectable } from '@nestjs/common';
import { FinvizRepository } from './finviz.repository';
import type { IFinviz } from './interfaces/finviz.interface';

@Injectable()
export class FinvizService {
  constructor(private readonly stockRepository: FinvizRepository) {}

  async get(stock: string): Promise<IFinviz> {
    return this.stockRepository.get(stock);
  }

  async set(stock: string, data: IFinviz): Promise<void> {
    return this.stockRepository.set(stock, data);
  }
}
