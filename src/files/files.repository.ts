import { EntityRepository, Repository } from 'typeorm';
import { File } from './file.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { Product } from 'src/products/product.entity';

interface IFile {
  filename: string;
  url: string;
  tags?: string[];
  // user: User;
}

@EntityRepository(File)
export class FileRepository extends Repository<File> {
  async createFile(fileOnRequest: IFile): Promise<File> {
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
