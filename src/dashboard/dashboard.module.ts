import { FeedbackModule } from './../feedback/feedback.module';
import { OrdersModule } from './../orders/orders.module';
import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [OrdersModule, FeedbackModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
