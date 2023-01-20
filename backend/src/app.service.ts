import { Injectable, Inject } from '@nestjs/common';
import { BarchartService } from './models/barchart/barchart.service';
import { IBarchartFinancial } from './models/barchart/interfaces/financial.interface';
import { IBarchartOverview } from './models/barchart/interfaces/overview.interface';
import { FinvizService } from './models/finviz/finviz.service';
import { IFinviz } from './models/finviz/interfaces/finviz.interface';
import { ShortsqueezeService } from './models/shortsqueeze/shortsqueeze.service';
import { TightshortsService } from './models/tightshorts/tightshorts.service';

@Injectable()
export class AppService {
  constructor(
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

  async getBarchartFinancial(
    ticker: string,
  ): Promise<IBarchartFinancial | null> {
    const saved = await this.barchartService.getFinancial(ticker);
    if (saved) {
      return saved;
    }

    const fetched = await this.barchartService.fetchFinancial(ticker);
    if (!fetched) {
      return null;
    }

    await this.barchartService.setFinancial(ticker, fetched);
    return fetched;
  }

  async getBarchartOverview(ticker: string): Promise<IBarchartOverview | null> {
    const saved = await this.barchartService.getOverview(ticker);
    if (saved) {
      return saved;
    }

    const fetched = await this.barchartService.fetchOverview(ticker);
    if (!fetched) {
      return null;
    }

    await this.barchartService.setOverview(ticker, fetched);
    return fetched;
  }
}
