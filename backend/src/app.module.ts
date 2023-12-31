import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';
import Joi from 'joi';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';
import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FinvizService } from './models/finviz/finviz.service';
import { FinvizRepository } from './models/finviz/finviz.repository';
import { BarchartRepository } from './models/barchart/barchart.repository';
import { BarchartService } from './models/barchart/barchart.service';
import { ShortsqueezeRepository } from './models/shortsqueeze/shortsqueeze.repository';
import { ShortsqueezeService } from './models/shortsqueeze/shortsqueeze.service';
import { TightshortsRepository } from './models/tightshorts/tightshorts.repository';
import { TightshortsService } from './models/tightshorts/tightshorts.service';

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
        REDIS_USER: Joi.string().default('default'),
        TTL_SHORTSQUEEZE: Joi.number().default(43200),
        TTL_FINVIZ: Joi.number().default(1200),
        TTL_BARCHART_OVERVIEW: Joi.number().default(1200),
        TTL_BARCHART_FINANCIAL: Joi.number().default(2592000),
        SHORT_API_KEY: Joi.string().required(),
        SHORT_API_URL: Joi.string().required(),
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
            connectTimeout: 2500,
          },
          username: config.get('REDIS_USER'),
          password: config.get('REDIS_PASSWORD'),
          database: 0,
          ttl: 60,
          pingInterval: 4 * 60 * 1000,
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
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    AppService,
    FinvizRepository,
    FinvizService,
    BarchartRepository,
    BarchartService,
    ShortsqueezeRepository,
    ShortsqueezeService,
    TightshortsRepository,
    TightshortsService,
  ],
})
export class AppModule {}
