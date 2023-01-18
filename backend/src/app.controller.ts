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

  // TODO: Cache this endpoint to prevent unnecessary requests
  @Get('finviz/:ticker')
  @UseFilters(new HttpExceptionFilter())
  async getFinviz(@Param('ticker') ticker: string) {
    const data = await this.appService.getFinviz(ticker);
    if (!data) {
      throw new NotFoundException();
    }
    return data;
  }
}
