import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { TightshortsRepository } from './tightshorts.repository';
import type { ITightshorts } from './interfaces/tightshorts.interface';
import type { ITightshortsChart } from './interfaces/chart.interface';

@Injectable()
export class TightshortsService {
  constructor(
    private readonly tightshortsRepository: TightshortsRepository,
    private readonly configService: ConfigService,
  ) {}

  async get(stockTicker: string): Promise<ITightshorts> {
    return this.tightshortsRepository.get(stockTicker);
  }

  async set(stockTicker: string, data: ITightshorts): Promise<void> {
    return this.tightshortsRepository.set(stockTicker, data);
  }

  async fetch(stockTicker: string): Promise<ITightshorts | null> {
    const config: AxiosRequestConfig<any> = {
      method: 'get',
      url: `${this.configService.get(
        'SHORT_API_URL',
      )}/stock?ticker=${stockTicker}&limit=21&sort=desc`,
      headers: {
        token: this.configService.get('SHORT_API_KEY'),
        'Content-Type': 'application/json',
      },
      validateStatus: (status) =>
        (status >= 200 && status < 300) || status === 404,
    };

    const response = await axios(config);
    if (response.status === 404) {
      return null;
    }
    const api = response.data;

    const currentShortVolume =
      ((api.volume[0].shortVolume / api.volume[0].totalVolume) * 100).toFixed(
        2,
      ) || null;
    const volume = api.volume.reverse();
    const chart: ITightshortsChart = {
      totalVolume: [],
      shortVolume: [],
      xAxis: [],
    };

    for (const el of volume) {
      chart.totalVolume.push(el.totalVolume);
      chart.shortVolume.push(el.shortVolume);
      chart.xAxis.push(el.date);
    }

    return {
      currentShortVolume,
      chart,
    };
  }
}
