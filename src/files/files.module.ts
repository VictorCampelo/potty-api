import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesController } from './files.controller';
import { FileRepository } from './files.repository';
import { FilesService } from './files.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}
