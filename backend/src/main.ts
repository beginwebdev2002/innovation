import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvironmentVariables } from '@config/env.interface';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService =
    app.get<ConfigService<EnvironmentVariables, true>>(ConfigService);
  const ORIGIN = configService.get('ORIGIN', { infer: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: '20mb' }));
  app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
  app.enableCors({
    origin: ORIGIN,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
    maxAge: 3600,
  });
  const PORT = configService.get('PORT', { infer: true }) || 3000;

  await app.listen(PORT);
}
void bootstrap();
