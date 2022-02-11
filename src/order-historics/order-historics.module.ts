import { OrderHistoricRepository } from './order-historics.repository';
import { Module } from '@nestjs/common';
import { OrderHistoricsService } from './order-historics.service';
import { OrderHistoricsController } from './order-historics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from 'src/orders/orders.module';
import { OrderHistoric } from './entities/order-historic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderHistoric])],
  controllers: [OrderHistoricsController],
  providers: [OrderHistoricsService],
  exports: [OrderHistoricsService],
})
export class OrderHistoricsModule {}
