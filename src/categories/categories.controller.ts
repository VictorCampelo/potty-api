import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/auth/role.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/users/user-roles.enum';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FindCategoriesDto } from './dto/find-categories-dto';
import { FindCategoriesProductsDto } from './dto/find-categories-products-dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  // @UseGuards(AuthGuard(), RolesGuard)
  // @Role(UserRole.ADMIN)
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get('findone/:id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }

  @Get('stores/:categoryId?')
  async findAllStoresCategories(@Param('categoryId') id?: string) {
    const categories = await this.categoriesService.findStoresCategories({
      categoryId: id,
    });
    return { categories: categories };
  }

  @Get('products/:storeId/:categoryId?')
  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.OWNER)
  async findAllProductsCategories(
    @Param('categoryId') categoryId?: string,
    @Param('storeId') storeId?: string,
  ) {
    const categories = await this.categoriesService.findProductsCategories({
      categoryId: categoryId,
      storeId: storeId,
    });

    return { categories: categories };
  }
}
