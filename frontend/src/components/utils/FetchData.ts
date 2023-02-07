import axios from "axios";
import type { IFinviz } from "@/components/interfaces/finviz.interface";
import type { IShortsqueeze } from "@/components/interfaces/shortsqueeze.interface";
import type { IBarchartOverview } from "@/components/interfaces/overview.interface";
import type { IBarchartFinancial } from "@/components/interfaces/financial.interface";
import type { ITightshorts } from "@/components/interfaces/tightshorts/tightshorts.interface";

export class FetchData {
  private static readonly baseUrl = import.meta.env.VITE_API_URL;

  public static async getFinviz(ticker: string): Promise<IFinviz | null> {
    try {
      const { data } = await axios.get(
        `${this.baseUrl}/stock/${ticker}/finviz`
      );
      return data;
    } catch (error) {
      return null;
    }
  }

  public static async getShortsqueeze(
    ticker: string
  ): Promise<IShortsqueeze | null> {
    try {
      const { data } = await axios.get(
        `${this.baseUrl}/stock/${ticker}/shortsqueeze`
      );
      return data;
    } catch (error) {
      return null;
    }
  }

  public static async getBarchartOverview(
    ticker: string
  ): Promise<IBarchartOverview | null> {
    try {
      const { data } = await axios.get(
        `${this.baseUrl}/stock/${ticker}/barchart/overview`
      );
      return data;
    } catch (error) {
      return null;
    }
  }

  public static async getBarchartFinancials(
    ticker: string
  ): Promise<IBarchartFinancial | null> {
    try {
      const { data } = await axios.get(
        `${this.baseUrl}/stock/${ticker}/barchart/financial`
      );
      return data;
    } catch (error) {
      return null;
    }
  }

  public static async getTightshorts(
    ticker: string
  ): Promise<ITightshorts | null> {
    try {
      const { data } = await axios.get(
        `${this.baseUrl}/stock/${ticker}/tightshorts`
      );
      return data;
    } catch (error) {
      return null;
    }
  }
}
