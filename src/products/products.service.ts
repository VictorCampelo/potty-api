import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesService } from 'src/files/files.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';
import { ProductRepository } from './products.repository';
import { UpdateProductImagesDto } from './dto/update-product-images.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
    private filesService: FilesService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const store = createProductDto.store;
    const product = this.productRepository.create(
      createProductDto.productFields,
    );

    product.store = store;

    if (createProductDto.files) {
      product.files = this.filesService.createFiles(createProductDto.files);
    }

    return await product.save();
  }

  async findAll(
    store_id: string,
    limit?: number,
    offset?: number,
    loadRelations = true,
    loadLastSolds = false,
  ): Promise<Product[]> {
    let orderingBy;
    if (loadLastSolds) {
      orderingBy = {
        lastSold: 'DESC',
      };
    } else {
      orderingBy = {
        sumOrders: 'ASC',
        avgStars: 'ASC',
      };
    }
    return await this.productRepository.find({
      where: { storeId: store_id },
      relations: loadRelations ? ['files'] : [],
      skip: offset ? offset : 0,
      take: limit ? limit : 10,
      order: orderingBy,
    });
  }

  async findOne(id: string): Promise<Product> {
    return this.productRepository.findOne(id, {
      relations: ['files'],
    });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async updateProductDetails(
    product_id: string,
    updateProductDto: UpdateProductDto,
  ) {
    let product = await this.findOne(product_id);

    if (!product) {
      throw new NotFoundException(
        "The product_id sent doesn't matches any Product on the database.",
      );
    }

    product = Object.assign(product, updateProductDto);

    return await this.productRepository.save(product);
  }

  async updateProductImages({
    product_id,
    toBeDeleted,
    files,
  }: UpdateProductImagesDto): Promise<Product> {
    const product = await this.findOne(product_id);

    if (!product) {
      throw new NotFoundException(
        "The product_id sent doesn't matches any product on the database.",
      );
    }

    if (toBeDeleted) {
      await this.filesService.remove(toBeDeleted);
    }

    if (files) {
      if (product.files) product.files = this.filesService.createFiles(files);
      else product.files.push(...this.filesService.createFiles(files));
    }

    return await product.save();
  }

  async remove(id: string) {
    return await this.productRepository.softDelete(id);
  }
}
