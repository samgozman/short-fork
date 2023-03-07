import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseFilters,
} from '@nestjs/common';
import { AppService } from './app.service';
import { TickerDto } from './dto/ticker.dto';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';

@Controller({
  path: 'stock/:ticker',
})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('finviz')
  @UseFilters(new HttpExceptionFilter())
  async getFinviz(@Param() params: TickerDto) {
    const data = await this.appService.getFinviz(params.ticker);
    if (!data) {
      throw new NotFoundException();
    }
    return data;
  }

  @Get('barchart/financial')
  @UseFilters(new HttpExceptionFilter())
  async getBarchartFinancial(@Param() params: TickerDto) {
    const data = await this.appService.getBarchartFinancial(params.ticker);
    if (!data) {
      throw new NotFoundException();
    }
    return data;
  }

  @Get('barchart/overview')
  @UseFilters(new HttpExceptionFilter())
  async getBarchartOverview(@Param() params: TickerDto) {
    const data = await this.appService.getBarchartOverview(params.ticker);
    if (!data) {
      throw new NotFoundException();
    }
    return data;
  }

  @Get('shortsqueeze')
  @UseFilters(new HttpExceptionFilter())
  async getShortsqueeze(@Param() params: TickerDto) {
    const data = await this.appService.getShortsqueeze(params.ticker);
    if (!data) {
      throw new NotFoundException();
    }
    return data;
  }

  @Get('tightshorts')
  @UseFilters(new HttpExceptionFilter())
  async getTightshorts(@Param() params: TickerDto) {
    const data = await this.appService.getTightshorts(params.ticker);
    if (!data) {
      throw new NotFoundException();
    }
    return data;
  }
}
