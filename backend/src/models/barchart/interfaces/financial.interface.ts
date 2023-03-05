export interface IBarchartFinancial {
  longTermDebt: number[];
  shareholdersEquity: number[];
  netIncome: number[];
  revenue: number[];
  /** Format: MM-YYYY */
  dates: string[];
}
