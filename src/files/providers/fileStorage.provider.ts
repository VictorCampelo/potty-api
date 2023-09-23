import { Injectable } from '@nestjs/common';
import { LocalFileService } from './../services/localFile.service';
import { S3FileService } from './../services/s3File.service';
import { File as FileEntity } from './../file.entity';

@Injectable()
export class FileStorageProvider {
  private readonly uploadFolder = 'public/uploads';

  constructor(
    private readonly localFileService: LocalFileService,
    private readonly s3FileService: S3FileService,
  ) {}

  async saveFiles(
    files: Express.Multer.File[],
    folderName?: string,
  ): Promise<FileEntity[]> {
    const useS3 = process.env.STORAGE_PROVIDER === 'S3';

    if (useS3) {
      return this.s3FileService.uploadMultipleFilesToS3(
        files,
        folderName || this.uploadFolder,
      );
    } else {
      return this.localFileService.createFiles(
        files,
        folderName || this.uploadFolder,
      );
    }
  }

  async removeFiles(ids: string[]): Promise<void> {
    const useS3 = process.env.USE_S3 === 'true';

    if (useS3) {
      return this.s3FileService.remove(ids);
    } else {
      return this.localFileService.deleteFiles(ids);
      // Handle file removal for the local file system if needed
    }
  }

  async updateFile(
    id: string,
    file: Express.Multer.File,
    folderName: string,
  ): Promise<any> {
    const useS3 = process.env.STORAGE_PROVIDER === 'S3';

    if (useS3) {
      return this.s3FileService.uploadSingleFileToS3(file, folderName);
    } else {
      return this.localFileService.updateFile(id, file);
    }
  }
}
