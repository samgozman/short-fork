import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:5173'
        : [
            'https://kss0s0kwk8o80kc4ccoc0kcg.extr.app',
            'https://short-fork-production.up.railway.app',
            'https://short-fork.up.railway.app',
            'https://short-fork.extr.app',
          ],
  });
  await app.listen(3000);
}
bootstrap();
