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
@UseGuards(AuthGuard(), RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Role(UserRole.OWNER)
  @UseInterceptors(
    FilesInterceptor('files', 3, {
      storage: memoryStorage(),
    }),
  )
  async create(
    @UploadedFiles() images: Express.Multer.File[],
    @Body(ValidationPipe) createProductDto: CreateProductDto,
  ) {
    try {
      // TODO: PEGAR O ID DA LOJA AQUI, E RELACIONAR COM O PRODUTO
      const product = await this.productsService.create(
        createProductDto,
        images,
      );
      return { product: product, message: 'Product created successfully' };
    } catch (error) {
      console.log('ERRO1:' + error);
    }
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Patch('details/:id')
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

  @Patch(':id')
  @Role(UserRole.OWNER)
  updateProductImages(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
