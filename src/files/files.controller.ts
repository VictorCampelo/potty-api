import {
  Body,
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/users/user.entity';
import { CreateFileDto } from './dto/create-file.dto';
import { File } from './file.entity';
import { FilesService } from './files.service';
import { Express } from 'express';
import { multerOptions } from 'src/configs/multer.config';

@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Post()
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async createFile(
    @UploadedFile() file: Express.Multer.File,
    @Body(ValidationPipe) createFileDto: CreateFileDto,
    @GetUser() user: User,
  ): Promise<File> {
    console.log(file);

    const fileUploaded = await this.filesService.create(
      file,
      createFileDto,
      user,
    );
    return fileUploaded;
  }
}
