import { Module } from '@nestjs/common';
import { UploadFilesService } from './upload-files.service';

@Module({
  providers: [UploadFilesService],
})
export class UploadFilesModule {}
