import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileRepository } from './files.repository';
import { File } from './file.entity';
import * as fs from 'fs';
@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileRepository)
    private fileRepository: FileRepository,
  ) {}
  async create(
    file: Express.Multer.File,
    createFileDto: CreateFileDto,
  ): Promise<File> {
    const { tags } = createFileDto;

    const fileToUpload = {
      url: `http://localhost:3000/${file.path}`,
      tags: tags,
      filename: file.filename,
    };

    return this.fileRepository.createFile(fileToUpload);
  }

  async createManyFiles(
    files: Express.Multer.File[],
    createFilesDto: CreateFileDto[],
  ) {
    console.log(createFilesDto);

    // const fileToUpload = {
    //   url: `http://localhost:3000/${file.path}`,
    //   tags: tags,
    //   filename: file.filename,
    // };

    // return this.fileRepository.createFile(fileToUpload);
    return 'service ok';
  }

  async createWithFile(file: Express.Multer.File): Promise<File> {
    fs.access('public/uploads', (error) => {
      if (error) {
        fs.mkdirSync('public/uploads', { recursive: true });
      }
    });
    const { buffer } = file;
    const timestamp = new Date().getTime();
    const ref = `${timestamp}.png`;

    await fs.writeFile('public/uploads/' + ref, buffer, (err) => {
      if (err) throw err;
    });
    const link = `http://localhost:3000/${ref}`;

    const fileToUpload = {
      name: ref,
      url: link,
      filename: file.filename,
      fieldname: null,
    };

    return await this.fileRepository.createFile(fileToUpload);
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

  async remove(id: string) {
    return await this.fileRepository.delete(id);
  }
}
