import { StoresModule } from './../stores/stores.module';
import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRepository } from './products.repository';
import { FilesModule } from 'src/files/files.module';
import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [
    TypeOrmModule.forFeature([ProductRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    FilesModule,
    StoresModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
