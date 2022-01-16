import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileRepository } from './files.repository';
import { File } from './file.entity';
import { v4 as uuid } from 'uuid';
import * as fs from 'fs';
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
export class FilesService {
  constructor(
    @InjectRepository(FileRepository)
    private readonly fileRepository: FileRepository,
  ) {}

  async createFiles(files: Express.Multer.File[]): Promise<File[]> {
    fs.access('public/uploads', (error) => {
      if (error) {
        fs.mkdirSync('public/uploads', { recursive: true });
      }
    });
    const filesToUpload = [];
    files.forEach((file) => {
      const { buffer } = file;
      const ref = `${uuid()}.png`;

      fs.writeFile('public/uploads/' + ref, buffer, (err) => {
        if (err) {
          throw err;
        }
      });
      const link = `http://localhost:3000/${ref}`;

      filesToUpload.push({
        name: ref,
        url: link,
        filename: file.originalname,
        fieldname: null,
      });
    });

    return this.fileRepository.save(filesToUpload);
  }

  async saveFile(file: File) {
    await this.fileRepository.save(file);
  }

  async saveAll(files: File[]) {
    await this.fileRepository.save(files);
  }

  async find() {
    return await this.fileRepository.find();
  }

  findOne(id) {
    return this.fileRepository.findOne(id, { relations: ['product'] });
  }

  update(id: number, _updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  async remove(ids: string[], files?: File[]) {
    let filesToDelete: File[] = files;

    if (!files) {
      filesToDelete = await this.fileRepository.findByIds(ids);
    }

    if (filesToDelete.length) {
      await this.fileRepository.delete(ids);
      try {
        await s3
          .deleteObjects({
            Bucket: process.env.AWS_BUCKET,
            Delete: {
              Objects: filesToDelete.map((file) => ({ Key: file.filename })),
            },
          })
          .promise();
      } catch (error) {
        throw new HttpException(
          `Erro ao deletar arquivos na S3: ${error}`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async uploadSingleFileToS3(
    file: Express.Multer.File,
    folderName: string,
  ): Promise<File> {
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
        alternativeText: file.originalname,
        ext: extension,
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Erro ao fazer upload na S3: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async uploadMultipleFilesToS3(
    files: Express.Multer.File[],
    folderName: string,
  ): Promise<File[]> {
    const images: File[] = [];

    for (const file of files) {
      const image = await this.uploadSingleFileToS3(file, folderName);
      images.push(image);
    }

    await this.saveAll(images);

    return images;
  }
}
