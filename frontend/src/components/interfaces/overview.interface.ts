import type { IBarchartAnalytics } from "./analytics.interface";
import type { IBarchartOptions } from "./options.interafce";

export interface IBarchartOverview {
  options: IBarchartOptions;
  analytics: IBarchartAnalytics;
}
