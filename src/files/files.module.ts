import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileRepository } from './files.repository';
import { FilesService } from './files.service';
import { FileStorageProvider } from './providers/fileStorage.provider';
import { LocalFileService } from './services/localFile.service';
import { S3FileService } from './services/s3File.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileRepository]),
  ],
  providers: [
    FilesService,
    LocalFileService,
    S3FileService,
    FileStorageProvider,
  ],
  exports: [FilesService, FileStorageProvider],
})
export class FilesModule {}
