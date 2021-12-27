import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileRepository } from './files.repository';
import { File } from './file.entity';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import AWS from 'aws-sdk';
import * as dotenv from 'dotenv';

dotenv.config();

interface IS3Params {
  Bucket: string;
  Key: string;
  Body: Express.Response;
}

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileRepository)
    private readonly fileRepository: FileRepository,
  ) {}
  async create(file: Express.Multer.File): Promise<File> {
    const { buffer } = file;
    const ref = `${uuidv4()}.png`;

    // fs.writeFile('public/uploads/' + ref, buffer, (err) => {
    //   if (err) {
    //     throw err;
    //   }
    // });
    // const link = `http://localhost:3000/${ref}`;

    const fileToUpload = {
      name: ref,
      // url: link,
      filename: file.originalname,
      fieldname: null,
    };

    const fileToSave = this.fileRepository.createFile(fileToUpload);

    return fileToSave.save();
  }

  async createFiles(files: Express.Multer.File[]): Promise<File[]> {
    fs.access('public/uploads', (error) => {
      if (error) {
        fs.mkdirSync('public/uploads', { recursive: true });
      }
    });
    const filesToUpload = [];
    files.forEach((file) => {
      const { buffer } = file;
      const ref = `${uuidv4()}.png`;

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

  async remove(id: string[]) {
    return await this.fileRepository.delete(id);
  }

  async uploadSingleFileToS3(file: Express.Multer.File): Promise<File> {
    const s3 = new AWS.S3({
      credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
      },
    });

    const { originalname } = file;
    const image = await this.create(file);

    const params: IS3Params = {
      Bucket: process.env.AWS_BUCKET,
      Key: String(originalname),
      Body: file.buffer,
    };

    try {
      await s3.putObject(params).promise();
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Erro ao fazer upload na S3: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // await this.saveFile(image);

    return image;
  }

  async uploadMultipleFilesToS3(files: Express.Multer.File[]): Promise<File[]> {
    const s3 = new AWS.S3({
      credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
      },
    });

    let params: IS3Params;
    let fileName = '';
    let images: File[];

    for (const file of files) {
      let currentImage: File;

      fileName = file.originalname;

      params = {
        Bucket: process.env.AWS_BUCKET,
        Key: String(fileName),
        Body: file.buffer,
      };

      await s3
        .putObject(params)
        .promise()
        .then(
          () => {
            currentImage.url = process.env.S3_URL + fileName;
          },
          (err) => {
            console.log(err);
            throw new HttpException(
              `Erro ao fazer upload na S3: ${err}`,
              HttpStatus.BAD_REQUEST,
            );
          },
        );

      images.push(currentImage);
    }

    await this.saveAll(images);

    return images;
  }
}
