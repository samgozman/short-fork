import axios from "axios";
import type { IFinviz } from "@/components/interfaces/finviz.interface";

export class FetchData {
  private static readonly baseUrl = import.meta.env.VITE_API_URL;

  public static async getFinviz(ticker: string): Promise<IFinviz> {
    const { data } = await axios.get(`${this.baseUrl}/stock/${ticker}/finviz`);
    return data;
  }
}
