import { Controller, Get, Param, UseFilters } from '@nestjs/common';
import { AppService } from './app.service';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('finviz/:ticker')
  @UseFilters(new HttpExceptionFilter())
  async getFinviz(@Param('ticker') ticker: string): Promise<any> {
    return this.appService.getFinviz(ticker);
  }
}
