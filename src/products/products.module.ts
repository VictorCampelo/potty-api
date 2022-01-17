import { StoresModule } from './../stores/stores.module';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRepository } from './products.repository';
import { FilesModule } from 'src/files/files.module';
import { PassportModule } from '@nestjs/passport';
import { CategoriesModule } from 'src/categories/categories.module';
import { UsersModule } from 'src/users/users.module';
import { celebrate } from 'celebrate';
import { createProductValidation } from './validations/create-product.validation';
import { findProductsValidation } from './validations/find-products.validation';
import { updateProductValidation } from './validations/update-product.validation';
@Module({
  imports: [
    TypeOrmModule.forFeature([ProductRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    FilesModule,
    StoresModule,
    CategoriesModule,
    UsersModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule implements NestModule {
  async configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(celebrate(createProductValidation))
      .forRoutes({ path: 'products', method: RequestMethod.POST });
    consumer
      .apply(celebrate(findProductsValidation))
      .forRoutes('products/store/:id');

    consumer
      .apply(celebrate(updateProductValidation))
      .forRoutes('products/details/:id');
  }
}
