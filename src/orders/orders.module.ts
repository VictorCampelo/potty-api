import { StoresModule } from 'src/stores/stores.module';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { PassportModule } from '@nestjs/passport';
import { ProductsModule } from 'src/products/products.module';
import { CouponsModule } from 'src/coupons/coupons.module';
import { OrderHistoricsModule } from 'src/order-historics/order-historics.module';
import { UsersModule } from 'src/users/users.module';
import { celebrate } from 'celebrate';
import { createOrderValidation } from './validations/create-order.validation';

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
export class OrdersModule implements NestModule {
  async configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(celebrate(createOrderValidation))
      .forRoutes({ path: 'orders', method: RequestMethod.POST });
  }
}
