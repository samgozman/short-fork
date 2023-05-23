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
            'https://short-fork-production.up.railway.app',
            'https://short-fork.up.railway.app',
            'https://short-fork.extr.app',
          ],
  });
  await app.listen(3000);
}
bootstrap();
