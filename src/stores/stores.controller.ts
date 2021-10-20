import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { GetUser } from 'src/auth/get-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/users/user-roles.enum';
import { User } from 'src/users/user.entity';
import { AddLikeDto } from './dto/add-like.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoresService } from './stores.service';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get()
  findAll() {
    return this.storesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.storesService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('files', 2, {
      storage: memoryStorage(),
    }),
  )
  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.OWNER)
  async update(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('id') id: string,
    @Body() updateStoreDto: UpdateStoreDto,
  ) {
    return await this.storesService.update(id, updateStoreDto, files);
  }

  @Delete(':id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.OWNER)
  remove(@Param('id') id: string) {
    return this.storesService.remove(+id);
  }

  @Post('addLike/:id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.USER)
  async addLikeToStore(@Param('id') storeId: string, @GetUser() user: User) {
    const store = await this.storesService.addLike(user, storeId);
    return { store: store, message: 'Sucessfuly added one like to the Store.' };
  }
}
