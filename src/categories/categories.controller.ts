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
import { GetUser } from 'src/auth/get-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { ErrorHandling } from 'src/configs/error-handling';
import { UserRole } from 'src/users/user-roles.enum';
import { User } from 'src/users/user.entity';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

const productsByCategory = 'products/:storeId/category/:categoryId';
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAllPublicCategories() {
    try {
      return await this.categoriesService.findAll();
    } catch (error) {
      throw new ErrorHandling(error);
    }
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

  @Patch('update/:categoryId')
  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.ADMIN)
  async updateCategory(
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Param('categoryId') id: string,
  ) {
    try {
      return await this.categoriesService.updateCategory(updateCategoryDto, id);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Delete('delete/:categoryId')
  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.ADMIN)
  async deleteCategory(@Param('categoryId') id: string) {
    try {
      return this.categoriesService.deleteStoreCategory(id);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Post('product')
  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.OWNER)
  async createProductStoreCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @GetUser() user: User,
  ) {
    try {
      return await this.categoriesService.create(
        createCategoryDto,
        'product',
        user.storeId,
      );
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Get('products/:storeId')
  // @UseGuards(AuthGuard(), RolesGuard)
  // @Role(UserRole.OWNER)
  async findAllProductsCategories(@Param('storeId') storeId: string) {
    try {
      return await this.categoriesService.findProductsCategories({
        storeId,
      });
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Get(productsByCategory)
  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.OWNER)
  async findOneStoresCategories(
    @Param('storeId') storeId: string,
    @Param('categoryId') categoryId: string,
  ) {
    try {
      return await this.categoriesService.findProductsCategories({
        storeId,
        categoryId,
      });
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Patch(productsByCategory)
  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.OWNER)
  async update(
    @Param('storeId') storeId: string,
    @Param('categoryId') categoryId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    try {
      return await this.categoriesService.update(
        { categoryId, storeId },
        updateCategoryDto,
      );
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Delete(productsByCategory)
  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.OWNER)
  async remove(
    @Param('storeId') storeId: string,
    @Param('categoryId') categoryId: string,
  ) {
    try {
      return await this.categoriesService.remove({ categoryId, storeId });
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }
}
