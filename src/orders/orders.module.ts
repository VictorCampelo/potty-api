import { StoresModule } from 'src/stores/stores.module';
import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { PassportModule } from '@nestjs/passport';
import { ProductsModule } from 'src/products/products.module';
import { CouponsModule } from 'src/coupons/coupons.module';
import { OrderHistoricsModule } from 'src/order-historics/order-historics.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ProductsModule,
    StoresModule,
    CouponsModule,
    OrderHistoricsModule,
    UsersModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
