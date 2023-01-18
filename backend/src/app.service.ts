import { Injectable, Inject } from '@nestjs/common';
import { BarchartService } from './models/barchart/barchart.service';
import { FinvizService } from './models/finviz/finviz.service';
import { IFinviz } from './models/finviz/interfaces/finviz.interface';
import { ShortsqueezeService } from './models/shortsqueeze/shortsqueeze.service';
import { StockService } from './models/stock/stock.service';
import { TightshortsService } from './models/tightshorts/tightshorts.service';

@Injectable()
export class AppService {
  constructor(
    @Inject(StockService) private stockService: StockService,
    @Inject(FinvizService) private finvizService: FinvizService,
    @Inject(BarchartService) private barchartService: BarchartService,
    @Inject(ShortsqueezeService) private squeezeService: ShortsqueezeService,
    @Inject(TightshortsService) private tightshortsService: TightshortsService,
  ) {}

  async getFinviz(ticker: string): Promise<IFinviz | null> {
    const saved = await this.finvizService.get(ticker);
    if (saved) {
      return saved;
    }

    const fetched = await this.finvizService.fetch(ticker);
    if (!fetched) {
      return null;
    }

    await this.finvizService.set(ticker, fetched);
    return fetched;
  }
}
