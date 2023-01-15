import { Injectable } from '@nestjs/common';
import { financials } from 'barchart-dot-com';
import { BarchartRepository } from './barchart.repository';
import type { IBarchartFinancial } from './interfaces/financial.interface';

@Injectable()
export class BarchartService {
  constructor(private readonly barchartRepository: BarchartRepository) {}

  async getFinancial(stockTicker: string): Promise<IBarchartFinancial> {
    return this.barchartRepository.getFinancial(stockTicker);
  }

  async setFinancial(
    stockTicker: string,
    data: IBarchartFinancial,
  ): Promise<void> {
    return this.barchartRepository.setFinancial(stockTicker, data);
  }

  async fetchFinancial(stockTicker: string): Promise<IBarchartFinancial> {
    const barchartFinancialsBalance = await financials
      .balanceSheet(stockTicker)
      .annual();
    const barchartFinancialsIncome = await financials
      .income(stockTicker)
      .annual();

    if (barchartFinancialsBalance.error || barchartFinancialsIncome.error) {
      return undefined;
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
}
