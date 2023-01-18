import { Injectable } from '@nestjs/common';
import { financials, quotes } from 'barchart-dot-com';
import { BarchartRepository } from './barchart.repository';
import type { IBarchartFinancial } from './interfaces/financial.interface';
import type { IBarchartOverview } from './interfaces/overview.interface';

@Injectable()
export class BarchartService {
  constructor(private readonly barchartRepository: BarchartRepository) {}

  async getFinancial(stockTicker: string): Promise<IBarchartFinancial | null> {
    return this.barchartRepository.getFinancial(stockTicker);
  }

  async getOverview(stockTicker: string): Promise<IBarchartOverview | null> {
    return this.barchartRepository.getOverview(stockTicker);
  }

  async setFinancial(
    stockTicker: string,
    data: IBarchartFinancial,
  ): Promise<void> {
    return this.barchartRepository.setFinancial(stockTicker, data);
  }

  async setOverview(
    stockTicker: string,
    data: IBarchartOverview,
  ): Promise<void> {
    return this.barchartRepository.setOverview(stockTicker, data);
  }

  async fetchFinancial(
    stockTicker: string,
  ): Promise<IBarchartFinancial | null> {
    let barchartFinancialsBalance: any, barchartFinancialsIncome: any;
    try {
      barchartFinancialsBalance = await financials
        .balanceSheet(stockTicker)
        .annual();
      barchartFinancialsIncome = await financials.income(stockTicker).annual();
    } catch (error) {
      console.error(error);
      return null;
    }

    if (barchartFinancialsBalance.error || barchartFinancialsIncome.error) {
      return null;
    }

    const startsWith = barchartFinancialsIncome.startsWith.split('-');
    const dates = [];
    for (let i = 0; i < barchartFinancialsIncome.periods; i++) {
      dates.push(startsWith[0] + '-' + Number(startsWith[1] - i));
    }

    const liabilities = barchartFinancialsBalance.liabilities;
    const liabilitiesLTD = liabilities.nonCurrentLiabilities
      ? liabilities.nonCurrentLiabilities.longTermDebt
      : null;
    const basicLongTermDebt = liabilities.longTermDebt
      ? liabilities.longTermDebt
      : null;

    const longDebt = liabilitiesLTD ? liabilitiesLTD : basicLongTermDebt;

    return {
      longTermDebt: longDebt ? [...longDebt].reverse() : null,
      shareholdersEquity: [
        ...barchartFinancialsBalance.shareholdersEquity.total,
      ].reverse(),
      netIncome: [...barchartFinancialsIncome.netIncome].reverse(),
      revenue: [...barchartFinancialsIncome.sales].reverse(),
      dates: [...dates].reverse(),
    };
  }

  async fetchOverview(stockTicker: string): Promise<IBarchartOverview | null> {
    let barchartOverview: any;
    try {
      barchartOverview = await quotes.overview(stockTicker);
    } catch (error) {
      console.error(error);
      return null;
    }

    if (barchartOverview.error) {
      // TODO: Add Sentry error logging
      return null;
    }

    return {
      options: {
        impliedVolatility: barchartOverview.options.impliedVolatility,
        historicalVolatility: barchartOverview.options.historicalVolatility,
        ivPercentile: barchartOverview.options.ivPercentile,
        ivRank: barchartOverview.options.ivRank,
        putCallVolRatio: barchartOverview.options.putCallVolRatio,
        todaysVolume: barchartOverview.options.todaysVolume,
        volumeAvg30Day: barchartOverview.options.volumeAvg30Day,
        putCallOiRatio: barchartOverview.options.putCallOiRatio,
        todaysOpenInterest: barchartOverview.options.todaysOpenInterest,
        openInt30Day: barchartOverview.options.openInt30Day,
      },
      analytics: {
        strongBuy: barchartOverview.analytics.strongBuy || 0,
        moderateBuy: barchartOverview.analytics.moderateBuy || 0,
        hold: barchartOverview.analytics.hold || 0,
        moderateSell: barchartOverview.analytics.moderateSell || 0,
        strongSell: barchartOverview.analytics.strongSell || 0,
      },
    };
  }
}
