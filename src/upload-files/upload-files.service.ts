import { Injectable } from '@nestjs/common';
import { CreateUploadFileDto } from './dto/create-upload-file.dto';
import { UpdateUploadFileDto } from './dto/update-upload-file.dto';
// import * as AWS from 'aws-sdk';
// import * as Minio from 'minio';

@Injectable()
export class UploadFilesService {
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

  create(createUploadFileDto: CreateUploadFileDto) {
    return 'This action adds a new uploadFile';
  }

  findAll() {
    return `This action returns all uploadFiles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} uploadFile`;
  }

  update(id: number, updateUploadFileDto: UpdateUploadFileDto) {
    return `This action updates a #${id} uploadFile`;
  }

  remove(id: number) {
    return `This action removes a #${id} uploadFile`;
  }

  /**
     async uploadFileToS3(fileStreamOrBuffer, fileName, userId) {
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

    async uploadFileToS3Minio(fileStreamOrBuffer, fileName, userId) {
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
