import { OrderHistoricRepository } from './order-historics.repository';
import { Module } from '@nestjs/common';
import { OrderHistoricsService } from './order-historics.service';
import { OrderHistoricsController } from './order-historics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderHistoricRepository]),
  ],
  controllers: [OrderHistoricsController],
  providers: [OrderHistoricsService]
})
export class OrderHistoricsModule {}
