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
  shortFlow: number | null;
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
  insidersDeals: any[]; // TODO: create interface
  // TODO: Move to separate interface
  earnings: {
    date: Date;
    marketTime: string;
  };
}
