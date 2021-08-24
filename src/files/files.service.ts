import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileRepository } from './files.repository';
import { File } from './file.entity';
import { User } from 'src/users/user.entity';
import * as fs from 'fs';

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

  async create(
    file: Express.Multer.File,
    createFileDto: CreateFileDto,
    user: User,
    //product: Product,
    //store: Store,
  ): Promise<File> {
    const { tags } = createFileDto;

    const fileToUpload = {
      url: `http://localhost:3000/${file.path}`,
      tags: tags,
      filename: file.filename,
      // user: user,
    };

    return this.fileRepository.createFile(fileToUpload);
  }

  async createWithFile(file: Express.Multer.File): Promise<File> {
    const uploadFolder = process.cwd() + './../../public/uploads';
    fs.access('public/uploads', (error) => {
      if (error) {
        fs.mkdirSync('public/uploads', { recursive: true });
      }
    });
    const { buffer, originalname } = file;
    const timestamp = new Date().getTime();
    const ref = `${timestamp}.png`;

    // await sharp(buffer)
    //   .webp({ quality: 20 })
    //   .toFile(uploadFolder + ref);
    await fs.writeFile('public/uploads/' + ref, buffer, (err) => {
      if (err) throw err;
    });
    const link = `http://localhost:3000/${ref}`;

    const fileToUpload = {
      name: ref,
      url: link,
      filename: file.filename,
    };

    return await this.fileRepository.createFile(fileToUpload);
  }

  async saveFile(file: File) {
    await this.fileRepository.save(file);
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

  async remove(id: string) {
    return await this.fileRepository.delete(id);
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
