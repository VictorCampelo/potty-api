import { EntityRepository, Repository } from 'typeorm';
import { File, FileAttributes } from './file.entity';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(File)
export class FileRepository extends Repository<File> {
  createFile(fileOnRequest: Partial<FileAttributes>): File {
    let fileToUpload = this.create();
    fileToUpload = Object.assign(fileToUpload, fileOnRequest);
    try {
      return fileToUpload;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao salvar arquivo no banco de dados' + error,
      );
    }
  }
}
