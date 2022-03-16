import { OrderHistoricsModule } from './../order-historics/order-historics.module';
import { ProductsModule } from 'src/products/products.module';
import { FeedbackModule } from './../feedback/feedback.module';
import { OrdersModule } from './../orders/orders.module';
import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { PassportModule } from '@nestjs/passport';
import { StoresModule } from 'src/stores/stores.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    OrdersModule,
    FeedbackModule,
    ProductsModule,
    OrderHistoricsModule,
    StoresModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
