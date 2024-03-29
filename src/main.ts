import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';
import * as dotenv from 'dotenv';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';

dotenv.config();

async function bootstrap() {
  // const logger = WinstonModule.createLogger(winstonConfig);
  // const app = await NestFactory.create(AppModule, { logger });
  const app = await NestFactory.create(AppModule);

  Sentry.init({
    dsn: process.env.SENTRY_DNS,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();

  app.use(json({ limit: '500mb' }));
  app.use(urlencoded({ limit: '500mb', extended: true }));

  const config = new DocumentBuilder()
    .setTitle('BDV API')
    .setDescription('BDV API Doc')
    .setVersion('1.0')
    .addTag('users')
    .addTag('admin')
    .addTag('owner')
    .addTag('dashboard')
    .addTag('orders')
    .addTag('products')
    .addTag('stores')
    .addTag('auth')
    .addTag('feedback')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'Bearer',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
