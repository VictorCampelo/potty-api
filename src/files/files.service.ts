import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileRepository } from './files.repository';
import { File } from './file.entity';
import { Store } from 'src/stores/store.entity';
import { User } from 'src/users/user.entity';
import { Product } from 'src/products/product.entity';
// import * as AWS from 'aws-sdk';
// import * as Minio from 'minio';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileRepository)
    private fileRepository: FileRepository,
  ) {}
  // private aws;
  // private awsMinio;

  // constructor() {
  //   this.aws = new AWS.S3({
  //     accessKeyId: process.env.ACCESS_KEY_ID,
  //     secretAccessKey: process.env.SECRET_ACCESS_KEY,
  //     region: process.env.REGION,
  //     params: {
  //       Bucket: process.env.BUCKET,
  //       ACL: 'public-read',
  //     },
  //   });
  //   this.awsMinio = new Minio.Client({
  //     endPoint: 's3.amazonaws.com',
  //     accessKey: process.env.S3_ACCESS_KEY_ID,
  //     secretKey: process.env.S3_SECRET_ACCESS_KEY,
  //   });
  // }

  create(
    file: Express.Multer.File,
    createFileDto: CreateFileDto,
    user: User,
    //product: Product,
    //store: Store,
  ): Promise<File> {
    const { url, tags } = createFileDto;

    const fileToUpload = {
      url: url,
      tags: tags,
      filename: file.originalname,
      user: user,
    };

    return this.fileRepository.createFile(fileToUpload); //,product, store);
  }

  findAll() {
    return `This action returns all files`;
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }

  /**
     async fileToS3(fileStreamOrBuffer, fileName, userId) {
     const extension = /(?:\.([^.]+))?$/.exec(fileName)[0];
      const { Location } = await this.aws
        .upload({
          Key: `users/${userId}/photo-${new Date().getTime()}${extension}`,
          Body: fileStreamOrBuffer,
          Bucket: process.env.BUCKET,
          ACL: 'public-read',
        })
        .promise();

      return Location;
    }

    async fileToS3Minio(fileStreamOrBuffer, fileName, userId) {
      const extension = /(?:\.([^.]+))?$/.exec(fileName)[0];
      const name = `users/${userId}/photo-${new Date().getTime()}${extension}`;
      const metaData = {
        'x-amz-acl': 'public-read',
      };
      try {
        await this.awsMinio.putObject(
          process.env.S3_BUCKET,
          name,
          fileStreamOrBuffer,
          metaData,
        );
      } catch (error) {
        throw error;
      }

      return `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${name}`;
    }
 */
}
