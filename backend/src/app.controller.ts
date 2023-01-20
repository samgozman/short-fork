import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseFilters,
} from '@nestjs/common';
import { AppService } from './app.service';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';

@Controller({
  path: 'stock/:ticker',
})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('finviz')
  @UseFilters(new HttpExceptionFilter())
  async getFinviz(@Param('ticker') ticker: string) {
    const data = await this.appService.getFinviz(ticker);
    if (!data) {
      throw new NotFoundException();
    }
    return data;
  }

  @Get('barchart/financial')
  @UseFilters(new HttpExceptionFilter())
  async getBarchartFinancial(@Param('ticker') ticker: string) {
    const data = await this.appService.getBarchartFinancial(ticker);
    if (!data) {
      throw new NotFoundException();
    }
    return data;
  }

  @Get('barchart/overview')
  @UseFilters(new HttpExceptionFilter())
  async getBarchartOverview(@Param('ticker') ticker: string) {
    const data = await this.appService.getBarchartOverview(ticker);
    if (!data) {
      throw new NotFoundException();
    }
    return data;
  }

  @Get('shortsqueeze')
  @UseFilters(new HttpExceptionFilter())
  async getShortsqueeze(@Param('ticker') ticker: string) {
    const data = await this.appService.getShortsqueeze(ticker);
    if (!data) {
      throw new NotFoundException();
    }
    return data;
  }

  @Get('tightshorts')
  @UseFilters(new HttpExceptionFilter())
  async getTightshorts(@Param('ticker') ticker: string) {
    const data = await this.appService.getTightshorts(ticker);
    if (!data) {
      throw new NotFoundException();
    }
    return data;
  }
}
