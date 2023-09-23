import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileRepository } from '../files.repository';
import { File as FileEntity } from '../file.entity';
import AWS from 'aws-sdk';
import path from 'path';

import * as dotenv from 'dotenv';

dotenv.config();

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

@Injectable()
export class S3FileService {
  constructor(
    @InjectRepository(FileRepository)
    private readonly fileRepository: FileRepository,
  ) {}

  async uploadSingleFileToS3(
    file: Express.Multer.File,
    folderName: string,
  ): Promise<FileEntity> {
    const extension = path.extname(file.originalname);
    const fileName =
      `${folderName}/${new Date().getTime()}${extension}`.replace(/\s/g, '');

    try {
      await s3
        .putObject({
          Bucket: process.env.AWS_BUCKET,
          Key: fileName,
          Body: file.buffer,
        })
        .promise();

      return this.fileRepository.createFile({
        name: file.originalname,
        url: `${process.env.S3_URL}${fileName}`,
        filename: fileName,
      });
    } catch (error) {
      console.error(error);
      throw new HttpException(
        `Error uploading to S3: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async uploadMultipleFilesToS3(
    files: Express.Multer.File[],
    folderName: string,
  ): Promise<FileEntity[]> {
    const images: FileEntity[] = [];

    for (const file of files) {
      const image = await this.uploadSingleFileToS3(file, folderName);
      images.push(image);
    }

    await this.saveAll(images);

    return images;
  }

  async saveAll(files: FileEntity[]) {
    await this.fileRepository.save(files);
  }

  async saveFile(file: File) {
    await this.fileRepository.save(file);
  }

  async remove(ids: string[]) {
    if (ids.length) {
      await this.fileRepository.delete(ids);
      try {
        await s3
          .deleteObjects({
            Bucket: process.env.AWS_BUCKET,
            Delete: {
              Objects: ids.map((id) => ({ Key: id })),
            },
          })
          .promise();
      } catch (error) {
        throw new HttpException(
          `Error deleting files from S3: ${error}`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
}
