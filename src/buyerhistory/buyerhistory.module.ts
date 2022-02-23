import { Module } from '@nestjs/common';
import { BuyerhistoryService } from './buyerhistory.service';
import { BuyerhistoryController } from './buyerhistory.controller';
import { BuyerHistory } from './entities/buyerhistory.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BuyerHistory])],
  controllers: [BuyerhistoryController],
  providers: [BuyerhistoryService],
  exports: [BuyerhistoryService],
})
export class BuyerhistoryModule {}
