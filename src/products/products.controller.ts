import { FindProductsDto } from './dto/find-products.dto';
import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Post,
  ValidationPipe,
  Query,
  Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { Role } from 'src/auth/role.decorator';
import { UserRole } from 'src/users/user-roles.enum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { UpdateProductImagesDto } from './dto/update-product-images.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { User } from 'src/users/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { ErrorHandling } from 'src/configs/error-handling';
import { multerOptions } from 'src/configs/multer.config';
import { FindPromotedDto } from './dto/find-promoted.dto';
import { UniqueUpdateDto } from './dto/unique-update.dto';
import { Request } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('related')
  async findRelatedProducts(
    @Req() request: Request,
    @Query()
    relatedDto: { categoryId: string; productName: string; storeId: string },
  ) {
    try {
      if (request.headers.app === 'marketplace') {
        return this.productsService.findRelatedMarketplace(relatedDto);
      }

      return this.productsService.findRelatedCatalog(relatedDto);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Get('promoted')
  async findWithDiscount(@Query() findPromotedDto: FindPromotedDto) {
    try {
      return await this.productsService.findWithDiscount(findPromotedDto);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Get('category/:id')
  @Role(UserRole.OWNER)
  async findFromCategory(@Param('id') categoryId: string) {
    try {
      return await this.productsService.findFromCategory(categoryId);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query(ValidationPipe) query: FindProductsDto,
  ) {
    try {
      return await this.productsService.findOne(id, query);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Get('store/:id')
  async findAllProduct(
    @Param('id') storeId: string,
    @Query(ValidationPipe) findProductsDto: FindProductsDto,
  ) {
    try {
      return await this.productsService.findAll(storeId, findProductsDto);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @ApiOperation({
    summary: 'Creates a product',
  })
  @Post()
  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.OWNER)
  @UseInterceptors(FilesInterceptor('files', 3, multerOptions))
  async create(
    @Body(ValidationPipe) createProductDto: CreateProductDto,
    @GetUser() user: User,
    @UploadedFiles() images?: Express.Multer.File[],
  ) {
    try {
      createProductDto.files = images;
      const product = await this.productsService.createProduct(
        createProductDto,
        user,
      );
      return { product, message: 'Product created successfully' };
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @ApiOperation({
    deprecated: true,
  })
  @Patch('details/:id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.OWNER)
  async updateProductDetails(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      const product = await this.productsService.updateProductDetails(
        id,
        updateProductDto,
      );
      return { product: product, message: 'Product successfully updated.' };
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @ApiOperation({
    deprecated: true,
  })
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
    try {
      updateProductImagesDto.product_id = id;
      updateProductImagesDto.files = images;
      const product = await this.productsService.updateProductImages(
        updateProductImagesDto,
      );

      return {
        product: product,
        message: 'Product images sucessfully updated.',
      };
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Patch('update/:id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.OWNER)
  @UseInterceptors(
    FilesInterceptor('files', 3, {
      storage: memoryStorage(),
    }),
  )
  async updateProduct(
    @Param('id') id: string,
    @Body() uniqueUpdateDto: UniqueUpdateDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    try {
      uniqueUpdateDto.product_id = id;
      uniqueUpdateDto.files = images;
      const product = await this.productsService.updateProduct(uniqueUpdateDto);

      return {
        product: product,
        message: 'Product sucessfully updated.',
      };
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.OWNER)
  async remove(@Param('id') id: string) {
    try {
      return await this.productsService.remove(id);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }
}
