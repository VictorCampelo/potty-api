import {
  Body,
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/users/user.entity';
import { CreateFileDto } from './dto/create-file.dto';
import { File } from './file.entity';
import { Express } from 'express';
import { multerOptions } from 'src/configs/multer.config';
import { Request } from '@nestjs/common';
import { FilesService } from './files.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @UseGuards(AuthGuard(), RolesGuard)
  @Post()
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async createFile(
    @UploadedFile() file: Express.Multer.File,
    @Body(ValidationPipe) createFileDto: CreateFileDto,
    @GetUser() user: User,
  ): Promise<File> {
    const fileUploaded = await this.filesService.create(
      file,
      createFileDto,
      user,
    );
    console.log(file);

    return fileUploaded;
  }
}
