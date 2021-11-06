import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/auth/role.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { ErrorHandling } from 'src/configs/error-handling';
import { UserRole } from 'src/users/user-roles.enum';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAllPublicCategories() {
    return this.categoriesService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.ADMIN)
  async createPublicCategory(@Body() createCategoryDto: CreateCategoryDto) {
    try {
      return await this.categoriesService.create(createCategoryDto, 'store');
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Post('product')
  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.OWNER)
  async createProductStoreCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    try {
      return await this.categoriesService.create(createCategoryDto, 'product');
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Get('products/:storeId')
  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.OWNER)
  async findAllProductsCategories(@Param('storeId') storeId: string) {
    try {
      return await this.categoriesService.findProductsCategories({
        storeId: storeId,
      });
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Get('products/:storeId/category/:categoryId')
  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.OWNER)
  async findOneStoresCategories(
    @Param('storeId') storeId: string,
    @Param('categoryId') categoryId: string,
  ) {
    try {
      return await this.categoriesService.findProductsCategories({
        storeId: storeId,
        categoryId: categoryId,
      });
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Patch('products/:storeId/category/:categoryId')
  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.OWNER)
  update(
    @Param('storeId') storeId: string,
    @Param('categoryId') categoryId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(
      { categoryId, storeId },
      updateCategoryDto,
    );
  }

  @Delete('products/:storeId/category/:categoryId')
  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.OWNER)
  remove(
    @Param('storeId') storeId: string,
    @Param('categoryId') categoryId: string,
  ) {
    return this.categoriesService.remove({ categoryId, storeId });
  }
}
