import {
  Body,
  Controller,
  HttpCode,
  ParseArrayPipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CreateFileDto } from './dto/create-file.dto';
import { File } from './file.entity';
import { Express } from 'express';
import { multerOptions } from 'src/configs/multer.config';
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
  ): Promise<File> {
    const fileUploaded = await this.filesService.create(file, createFileDto);
    return fileUploaded;
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @Post('multiple')
  @HttpCode(201)
  @UseInterceptors(FilesInterceptor('files', 10))
  async createMultipleFiles(
    @UploadedFiles() images: Express.Multer.File[],
    @Body(ValidationPipe) createFileDto: CreateFileDto,
    // @Body(new ParseArrayPipe({ items: CreateFileDto }))
    // createFilesDto: CreateFileDto[],
  ) {
    console.log(images);

    // const filesUploadedList = await this.filesService.createManyFiles(
    //   images,
    //   createFilesDto,
    // );

    // return filesUploadedList;
  }
}
