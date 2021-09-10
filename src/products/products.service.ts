import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesService } from 'src/files/files.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';
import { StoresService } from 'src/stores/stores.service';
import { ProductRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
    private filesService: FilesService,
    private storeService: StoresService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    files: Express.Multer.File[],
  ): Promise<Product> {
    const store = await this.storeService.findOne(createProductDto.store_id);

    if (!store) {
      throw new NotFoundException(
        "The store_id sent doesn't matches any Store on the database.",
      );
    }

    const product = await this.productRepository.createProduct(
      createProductDto,
      store,
    );
    const fileUploaded = [];
    if (files && product) {
      files.forEach(async (file) => {
        fileUploaded.push(await this.filesService.createWithFile(file));
      });
      product.files = fileUploaded;
    }

    await product.save();

    return product;
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
