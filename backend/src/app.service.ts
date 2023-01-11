import { Injectable, Inject } from '@nestjs/common';
import { StockService } from './models/stock/stock.service';

@Injectable()
export class AppService {
  constructor(@Inject(StockService) private stockService: StockService) {}
  async getHello(): Promise<string> {
    await this.stockService.addStock('AAPL');
    await this.stockService.addStock('GOOGL');
    await this.stockService.addStock('MSFT');
    return 'Hello World!';
  }
}
