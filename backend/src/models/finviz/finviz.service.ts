import { Injectable } from '@nestjs/common';
import { stock } from 'finvizor';
import { FinvizRepository } from './finviz.repository';
import type { IFinviz } from './interfaces/finviz.interface';

@Injectable()
export class FinvizService {
  constructor(private readonly finvizRepository: FinvizRepository) {}

  async get(stockTicker: string): Promise<IFinviz | null> {
    return this.finvizRepository.get(stockTicker);
  }

  async set(stockTicker: string, data: IFinviz): Promise<void> {
    return this.finvizRepository.set(stockTicker, data);
  }

  /**
   * Fetches data from finviz.com
   * @param stockTicker - stock ticker
   * @returns IFinviz object
   */
  async fetch(stockTicker: string): Promise<IFinviz | null> {
    try {
      const response = await stock(stockTicker);
      const data: IFinviz = {
        name: response.name,
        exchange: response.exchange,
        country: response.country,
        price: response.price,
        pe: response.pe,
        forwardPe: response.forwardPe,
        ps: response.ps,
        pb: response.pb,
        roe: response.roe,
        roa: response.roa,
        debtEq: response.debtEq,
        shortFloat: response.shortFloat,
        targetPrice: response.targetPrice,
        rsi: response.rsi,
        recommendation: response.recom,
        site: response.site,
        peg: response.peg,
        dividendPercent: response.dividendPercent,
        instOwn: response.instOwn,
        insiderOwn: response.insiderOwn,
        beta: response.beta,
        shortRatio: response.shortRatio,
        insidersDeals: response.insidersDeals.map((s) => {
          return {
            insiderTrading: s.insiderTrading,
            relationship: s.relationship,
            date: s.date,
            transaction: s.transaction,
            value: s.value,
          };
        }),
        earnings: {
          date: response.earnings.date,
          marketTime: response.earnings.marketTime,
        },
      };
      return data;
    } catch (error) {
      return null;
    }
  }
}
