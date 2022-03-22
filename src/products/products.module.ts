import { StoresModule } from './../stores/stores.module';
import {
  HttpException,
  HttpStatus,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesModule } from 'src/files/files.module';
import { PassportModule } from '@nestjs/passport';
import { CategoriesModule } from 'src/categories/categories.module';
import { UsersModule } from 'src/users/users.module';
import { Product } from './product.entity';
import { Request, Response, NextFunction } from 'express';
@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
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
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req: Request, res: Response, next: NextFunction) => {
        if (
          typeof req.headers.app !== 'string' ||
          !/^catalog$|^marketplace$/g.test(req.headers.app)
        ) {
          throw new HttpException('Invalid request', HttpStatus.BAD_REQUEST);
        }
        next();
      })
      .forRoutes('products/related');
  }
}
