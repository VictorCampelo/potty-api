import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { mailerConfig } from './configs/mailer.config';
import { typeOrmConfig } from './configs/typeorm.config';
import { winstonConfig } from './configs/winston.config';
import { LoggerInterceptor } from './interceptors/logger.interceptor';
import { ToolsModule } from './tools/tools.module';
import { UsersModule } from './users/users.module';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    WinstonModule.forRoot(winstonConfig),
    MailerModule.forRoot(mailerConfig),
    UsersModule,
    AuthModule,
    ToolsModule,
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
