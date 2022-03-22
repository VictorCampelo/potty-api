import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { ErrorHandling } from 'src/configs/error-handling';
import { multerOptions } from 'src/configs/multer.config';
import { UserRole } from 'src/users/user-roles.enum';
import { User } from 'src/users/user.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { FindStoreDto } from './dto/find-store.dto';
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
      throw new ErrorHandling(error);
    }
  }

  @Get('id/:id')
  async findOneById(@Param('id') id: string) {
    try {
      return await this.storesService.findOne(id);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.OWNER)
  @Get('me')
  async getStoreMe(@GetUser() user: User) {
    try {
      return await this.storesService.findStoreMe(user.id);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Get('categories/:categoryId')
  async findByCategory(@Param('categoryId') catId: string) {
    try {
      return this.storesService.findFromCategory(catId);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Get('find/:name')
  async findOneByName(@Param('name') name: string) {
    try {
      return await this.storesService.findOneByName(name);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Patch()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'avatar',
          maxCount: 1,
        },
        {
          name: 'background',
          maxCount: 1,
        },
      ],
      multerOptions,
    ),
  )
  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.OWNER)
  @ApiConsumes('multipart/form-data')
  async update(
    @GetUser() user: User,
    @Body(ValidationPipe) updateStoreDto: { storeDto: UpdateStoreDto },
    @UploadedFiles()
    {
      avatar,
      background,
    }: {
      avatar: Express.Multer.File;
      background: Express.Multer.File;
    },
  ) {
    const { storeDto } = JSON.parse(JSON.stringify(updateStoreDto));

    try {
      return await this.storesService.update(
        user.storeId,
        JSON.parse(storeDto),
        [avatar ? avatar[0] : null, background ? background[0] : null],
      );
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Delete('delete/:id') //! from :id to delete/:id
  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.OWNER)
  async remove(@Param('id') id: string) {
    try {
      return await this.storesService.remove(+id);
    } catch (error) {
      throw new ErrorHandling(error);
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
      throw new ErrorHandling(error);
    }
  }

  @Get('search')
  async findOnSearch(@Query(ValidationPipe) query: FindStoreDto) {
    try {
      return await this.storesService.findOnSearch(query);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Get('searchProducts/:storeId')
  async findOnSearchProducts(
    @Param('storeId') storeId: string,
    @Query(ValidationPipe) query: FindStoreDto,
  ) {
    try {
      return await this.storesService.findOnSearchProduct(storeId, query);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @UseInterceptors(FileInterceptor('avatar', multerOptions))
  @Post('create')
  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.OWNER)
  async createStore(
    @UploadedFile() storeAvatar: Express.Multer.File,
    @Body(ValidationPipe) createStore: CreateStoreDto,
    @GetUser() user: User,
  ) {
    try {
      createStore.avatar = storeAvatar;
      return this.storesService.create(createStore, user.id);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }
}
