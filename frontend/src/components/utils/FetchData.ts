import axios from "axios";
import type { IFinviz } from "@/components/interfaces/finviz.interface";
import type { IShortsqueeze } from "@/components/interfaces/shortsqueeze.interface";
import type { IBarchartOverview } from "@/components/interfaces/overview.interface";

export class FetchData {
  private static readonly baseUrl = import.meta.env.VITE_API_URL;

  public static async getFinviz(ticker: string): Promise<IFinviz> {
    const { data } = await axios.get(`${this.baseUrl}/stock/${ticker}/finviz`);
    return data;
  }

  public static async getShortsqueeze(ticker: string): Promise<IShortsqueeze> {
    const { data } = await axios.get(
      `${this.baseUrl}/stock/${ticker}/shortsqueeze`
    );
    return data;
  }

  public static async getBarchartOverview(
    ticker: string
  ): Promise<IBarchartOverview> {
    const { data } = await axios.get(
      `${this.baseUrl}/stock/${ticker}/barchart/overview`
    );
    return data;
  }
}
