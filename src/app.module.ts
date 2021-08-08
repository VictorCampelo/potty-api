import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { mailerConfig } from './configs/mailer.config';
import { configService } from './configs/typeorm.config';
import { winstonConfig } from './configs/winston.config';
import { LoggerInterceptor } from './interceptors/logger.interceptor';
import { UsersModule } from './users/users.module';
import { ShopsModule } from './shops/shops.module';
import { ProductsModule } from './products/products.module';
import { EmailsModule } from './emails/emails.module';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    WinstonModule.forRoot(winstonConfig),
    MailerModule.forRoot(mailerConfig),
    EmailsModule,
    UsersModule,
    AuthModule,
    ShopsModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
  ],
})
export class AppModule {}
