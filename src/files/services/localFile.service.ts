// local-file.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuid } from 'uuid';
import { FileRepository } from '../files.repository';
import { File as FileEntity } from '../file.entity';

@Injectable()
export class LocalFileService {
  private readonly uploadFolder = 'public/uploads';

  constructor(
    @InjectRepository(FileRepository)
    private readonly fileRepository: FileRepository,
  ) {
    if (!fs.existsSync(this.uploadFolder)) {
      fs.mkdirSync(this.uploadFolder, { recursive: true });
    }
  }

  async createFiles(
    files: Express.Multer.File[],
    folderName: string,
  ): Promise<FileEntity[]> {
    const filesToUpload = [];

    try {
      for (const file of files) {
        const { buffer } = file;
        const ref = `${uuid()}.png`;

        const filePath = path.join(this.uploadFolder, ref);
        fs.writeFileSync(filePath, buffer);

        const link = `http://localhost:3001/${ref}`;

        filesToUpload.push({
          name: ref,
          url: link,
          filename: file.originalname,
          fieldname: null,
        });
      }

      // Save the files to the database
      const savedFiles = await this.fileRepository.save(filesToUpload);

      return savedFiles;
    } catch (error) {
      console.log(error)
      throw new HttpException(
        'Failed to save files locally',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateFile(
    fileId: string,
    updatedFile: Partial<FileEntity>,
  ): Promise<FileEntity> {
    try {
      const existingFile = await this.fileRepository.findOne(fileId);

      if (!existingFile) {
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      }

      const filePath = path.join(this.uploadFolder, existingFile.name);

      // Check if the file exists and then delete it
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Update the fields of the existing file with the provided data
      Object.assign(existingFile, updatedFile);

      // Save the updated file entity
      const updatedFileEntity = await this.fileRepository.save(existingFile);

      return updatedFileEntity;
    } catch (error) {
      throw new HttpException(
        'Failed to update file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteFiles(fileIds: string[]): Promise<void> {
    try {
      for (const fileId of fileIds) {
        const file = await this.fileRepository.findOne(fileId);

        if (file) {
          const filePath = path.join(this.uploadFolder, file.name);

          // Check if the file exists and then delete it
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }

          // Delete the file record from the database
          await this.fileRepository.delete(fileId);
        }
      }
    } catch (error) {
      throw new HttpException(
        'Failed to delete files locally',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
