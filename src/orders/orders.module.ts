import { StoresModule } from 'src/stores/stores.module';
import {
  HttpException,
  HttpStatus,
  MiddlewareConsumer,
  Module,
  NestModule,
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
import { Request, NextFunction } from 'express';

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
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req: Request, res: Response, next: NextFunction) => {
        let keys = [
          'firstName',
          'lastName',
          'uf',
          'city',
          'street',
          'neighborhood',
          'addressNumber',
          // 'logradouro',
          'zipcode',
          'complement',
        ];
        const guestAddress = req.body.guestAddress;
        keys.forEach((key) => {
          if (key !== 'complement' && key !== 'lastName') {
            if (guestAddress[key] === undefined || guestAddress[key] === '') {
              throw new HttpException(
                'Missing address information ' + key,
                HttpStatus.BAD_REQUEST,
              );
            }
          } else {
            if (guestAddress[key] === undefined) guestAddress[key] = '';
          }
        });
        next();
      })
      .forRoutes('orders/guest');
  }
}
