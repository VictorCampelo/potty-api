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
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { GetUser } from 'src/auth/get-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { ErrorHandling } from 'src/configs/error-handling';
import { UserRole } from 'src/users/user-roles.enum';
import { User } from 'src/users/user.entity';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoresService } from './stores.service';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get()
  async findAll() {
    try {
      return await this.storesService.findAll();
    } catch (error) {
      new ErrorHandling(error);
    }
  }

  @Get('id/:id')
  async findOneById(@Param('id') id: string) {
    try {
      return await this.storesService.findOne(id);
    } catch (error) {
      new ErrorHandling(error);
    }
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.OWNER)
  @Get('me')
  async getStoreMe(@GetUser() user: User) {
    try {
      return await this.storesService.findStoreMe(user.id);
    } catch (error) {
      new ErrorHandling(error);
    }
  }

  @Get(':name')
  async findOneByName(@Param('name') name: string) {
    try {
      return await this.storesService.findOneByName(name);
    } catch (error) {
      new ErrorHandling(error);
    }
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
    try {
      return await this.storesService.update(id, updateStoreDto, files);
    } catch (error) {
      new ErrorHandling(error);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.OWNER)
  async remove(@Param('id') id: string) {
    try {
      return await this.storesService.remove(+id);
    } catch (error) {
      new ErrorHandling(error);
    }
  }

  @Post('addLike/:name')
  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.USER)
  async addLikeToStore(@Param('name') name: string, @GetUser() user: User) {
    try {
      const store = await this.storesService.addLike(user, name);
      return {
        store: store,
        message: 'Sucessfuly added one like to the Store.',
      };
    } catch (error) {
      new ErrorHandling(error);
    }
  }
}
