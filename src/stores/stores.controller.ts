import { CategoriesService } from 'src/categories/categories.service';
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
import { CreateCategoryDto } from 'src/categories/dto/create-category.dto';
import { UserRole } from 'src/users/user-roles.enum';
import { User } from 'src/users/user.entity';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoresService } from './stores.service';

@Controller('stores')
export class StoresController {
  constructor(
    private readonly storesService: StoresService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Get()
  findAll() {
    return this.storesService.findAll();
  }

  @Get('id/:id')
  async findOneById(@Param('id') id: string) {
    return await this.storesService.findOne(id);
  }

  @Get(':name')
  async findOneByName(@Param('name') name: string) {
    return await this.storesService.findOneByName(name);
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

  @Post('addLike/:name')
  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.USER)
  async addLikeToStore(@Param('name') name: string, @GetUser() user: User) {
    const store = await this.storesService.addLike(user, name);
    return { store: store, message: 'Sucessfuly added one like to the Store.' };
  }

  @Post('createCategoryToProduct')
  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.OWNER)
  async addProductCategories(@Body() createCategoryDto: CreateCategoryDto) {
    const store = await this.storesService.findOne(createCategoryDto.storeId);
    const category = await this.categoriesService.createProductCategory({
      name: createCategoryDto.name,
      store: store,
    });
    return {
      category: category,
      message: 'Sucessfuly added category to productin the Store.',
    };
  }
}
