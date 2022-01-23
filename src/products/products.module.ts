import { StoresModule } from './../stores/stores.module';
import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesModule } from 'src/files/files.module';
import { PassportModule } from '@nestjs/passport';
import { CategoriesModule } from 'src/categories/categories.module';
import { UsersModule } from 'src/users/users.module';
import { Product } from './product.entity';
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
export class ProductsModule {}
