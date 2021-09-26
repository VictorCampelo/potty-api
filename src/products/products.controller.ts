import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Role } from 'src/auth/role.decorator';
import { UserRole } from 'src/users/user-roles.enum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { UpdateProductImagesDto } from './dto/update-product-images.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/users/user.entity';
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.OWNER)
  @UseInterceptors(
    FilesInterceptor('files', 3, {
      storage: memoryStorage(),
    }),
  )
  async create(
    @UploadedFiles() images: Express.Multer.File[],
    @Body(ValidationPipe) createProductDto: CreateProductDto,
    @GetUser() user: User,
  ) {
    try {
      createProductDto.files = images;
      createProductDto.store = user.store;
      const product = await this.productsService.create(createProductDto);
      return { product: product, message: 'Product created successfully' };
    } catch (error) {
      console.log('ERRO1:' + error);
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.OWNER)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Patch('details/:id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.OWNER)
  async updateProductDetails(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productsService.updateProductDetails(
      id,
      updateProductDto,
    );
    return { product: product, message: 'Product successfully updated.' };
  }

  @Patch('images/:id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.OWNER)
  @UseInterceptors(
    FilesInterceptor('files', 3, {
      storage: memoryStorage(),
    }),
  )
  async updateProductImages(
    @Param('id') id: string,
    @Body() updateProductImagesDto: UpdateProductImagesDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    updateProductImagesDto.product_id = id;
    updateProductImagesDto.files = images;
    const product = await this.productsService.updateProductImages(
      updateProductImagesDto,
    );

    return { product: product, message: 'Product images sucessfully updated.' };
  }

  @Delete(':id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.OWNER)
  async remove(@Param('id') id: string) {
    await this.productsService.remove(id);
    return { message: 'Product sucessfully removed.' };
  }
}
