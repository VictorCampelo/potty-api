import { EntityRepository, Repository } from 'typeorm';
import { File } from './file.entity';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { User } from 'src/users/user.entity';
import { Product } from 'src/products/product.entity';
import { Store } from 'src/stores/store.entity';

interface IFile {
  name: string;
  filename: string;
  url: string;
  tags?: string[];
  // user: User;
}

@EntityRepository(File)
export class FileRepository extends Repository<File> {
  async createFile(IFile): Promise<File> {
    let fileToUpload = this.create();
    fileToUpload = Object.assign(fileToUpload, IFile);
    try {
      return fileToUpload;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao salvar arquivo no banco de dados' + error,
      );
    }
  }
}
