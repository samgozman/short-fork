import Joi from 'joi';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';
import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StockService } from './models/stock/stock.service';
import { StockRepository } from './models/stock/stock.repository';
import { FinvizService } from './models/finviz/finviz.service';
import { FinvizRepository } from './models/finviz/finviz.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `config/${process.env.NODE_ENV}.env`,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3000),
        REDIS_HOST: Joi.string().default('localhost'),
        REDIS_PORT: Joi.number().default(6379),
        REDIS_PASSWORD: Joi.string().default(''),
        TTL_SHORTSQUEEZE: Joi.number().default(43200000),
        TTL_FINVIZ: Joi.number().default(1200000),
        TTL_TIGHTSHORTS: Joi.number().default(14400000),
        TTL_BARCHART_OVERVIEW: Joi.number().default(1200000),
        TTL_BARCHART_FINANCIAL: Joi.number().default(2592000000),
      }),
    }),
    // TODO: Replace it with actual Redis DB
    CacheModule.registerAsync<any>({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: config.get('REDIS_HOST'),
            port: config.get('REDIS_PORT'),
          },
          username: 'default',
          password: config.get('REDIS_PASSWORD'),
          database: 0,
          ttl: 60,
        });
        return {
          store: () => store,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    StockRepository,
    StockService,
    FinvizRepository,
    FinvizService,
  ],
})
export class AppModule {}
