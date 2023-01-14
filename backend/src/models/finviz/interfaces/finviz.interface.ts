import { IEarnings } from './earnings.interface';
import { IInsider } from './insider.interface';

export interface IFinviz {
  name: string;
  exchange: string;
  country: string;
  price: number;
  pe: number | null;
  forwardPe: number | null;
  ps: number | null;
  pb: number | null;
  roe: number | null;
  roa: number | null;
  debtEq: number | null;
  shortFloat: number | null;
  targetPrice: number | null;
  rsi: number | null;
  recommendation: number | null;
  site: string | null;
  peg: number | null;
  dividendPercent: number | null;
  instOwn: number | null;
  insiderOwn: number | null;
  beta: number | null;
  shortRatio: number | null;
  insidersDeals: IInsider[];
  earnings: IEarnings;
}
