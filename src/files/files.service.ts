import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileRepository } from './files.repository';
import { File } from './file.entity';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileRepository)
    private readonly fileRepository: FileRepository,
  ) {}
  async create(file: Express.Multer.File): Promise<File> {
    const { buffer } = file;
    const ref = `${uuidv4()}.png`;

    fs.writeFile('public/uploads/' + ref, buffer, (err) => {
      if (err) {
        throw err;
      }
    });
    const link = `http://localhost:3000/${ref}`;

    const fileToUpload = {
      name: ref,
      url: link,
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
}
