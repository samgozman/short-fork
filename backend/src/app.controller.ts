import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseFilters,
} from '@nestjs/common';
import { AppService } from './app.service';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('finviz/:ticker')
  @UseFilters(new HttpExceptionFilter())
  async getFinviz(@Param('ticker') ticker: string) {
    const data = await this.appService.getFinviz(ticker);
    if (!data) {
      throw new NotFoundException();
    }
    return data;
  }

  @Get('barchart/financial/:ticker')
  @UseFilters(new HttpExceptionFilter())
  async getBarchartFinancial(@Param('ticker') ticker: string) {
    const data = await this.appService.getBarchartFinancial(ticker);
    if (!data) {
      throw new NotFoundException();
    }
    return data;
  }

  @Get('barchart/overview/:ticker')
  @UseFilters(new HttpExceptionFilter())
  async getBarchartOverview(@Param('ticker') ticker: string) {
    const data = await this.appService.getBarchartOverview(ticker);
    if (!data) {
      throw new NotFoundException();
    }
    return data;
  }
}
