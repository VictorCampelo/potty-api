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
  filename: string;
  url: string;
  tags: string[];
  user: User;
}

@EntityRepository(File)
export class FileRepository extends Repository<File> {
  async createFile({ url, tags, filename, user }: IFile): Promise<File> {
    const fileToUpload = this.create();
    fileToUpload.name = filename;
    fileToUpload.url = url;
    fileToUpload.user = user;
    fileToUpload.tags = tags;
    try {
      await fileToUpload.save();
      return fileToUpload;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao salvar arquivo no banco de dados' + error,
      );
    }
  }
}
