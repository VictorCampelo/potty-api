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
import { StoresModule } from './stores/stores.module';
import { ProductsModule } from './products/products.module';
import { EmailsModule } from './emails/emails.module';
import { FilesModule } from './files/files.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { FeedbackModule } from './feedback/feedback.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CouponsModule } from './coupons/coupons.module';
import { OrderHistoricsModule } from './order-historics/order-historics.module';
import { PlansModule } from './plans/plans.module';
import { PaymentsModule } from './payments/payments.module';
import { GoogleStrategy } from './auth/google.strategy';
import { FacebookStrategy } from './auth/facebook.strategy';
import { BuyerhistoryModule } from './buyerhistory/buyerhistory.module';
import { ServeStaticModule } from '@nestjs/serve-static'; // Importe o módulo para servir arquivos estáticos
import * as path from 'path'; // Importe o módulo 'path' para lidar com caminhos de arquivos


dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    // WinstonModule.forRoot(winstonConfig),
    MailerModule.forRoot(mailerConfig),
    EmailsModule,
    UsersModule,
    AuthModule,
    StoresModule,
    ProductsModule,
    FilesModule,
    CategoriesModule,
    OrdersModule,
    FeedbackModule,
    DashboardModule,
    CouponsModule,
    OrderHistoricsModule,
    PlansModule,
    PaymentsModule,
    BuyerhistoryModule,
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '..', 'public', 'uploads'), // Caminho para o diretório de uploads
      serveRoot: '/uploads', // Rota de onde os arquivos serão servidos
    }),
  ],
  controllers: [AppController],
  // providers: [
  //   {
  //     provide: APP_INTERCEPTOR,
  //     useClass: LoggerInterceptor,
  //   },
  // ],
  providers: [GoogleStrategy, FacebookStrategy],
})
export class AppModule {}
