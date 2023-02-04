// Missing types for ApexCharts

// Type from the ApexCharts library with missing export
export type ApexAxisChartSeries = {
  name?: string;
  type?: string;
  color?: string;
  data:
    | (number | null)[]
    | {
        x: any;
        y: any;
        fill?: ApexFill;
        fillColor?: string;
        strokeColor?: string;
        meta?: any;
        goals?: any;
        barHeightOffset?: number;
        columnWidthOffset?: number;
      }[]
    | [number, number | null][]
    | [number, (number | null)[]][]
    | number[][];
}[];

export type ApexNonAxisChartSeries = number[];

export type ApexChartSeries = ApexAxisChartSeries | ApexNonAxisChartSeries;
