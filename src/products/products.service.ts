import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesService } from 'src/files/files.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';
import { StoresService } from 'src/stores/stores.service';
import { ProductRepository } from './products.repository';
import { UpdateProductImagesDto } from './dto/update-product-images.dto';

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

    const fileUploaded = [];

    if (files) {
      const create_file_promises = await files.map(async (file) => {
        const currentFile = await this.filesService.createWithFile(file);
        fileUploaded.push(currentFile);
      });

      await Promise.all(create_file_promises);
    }

    if (fileUploaded) {
      const save_file_promises = fileUploaded.map(async (file) => {
        await this.filesService.saveFile(file);
      });

      await Promise.all(save_file_promises);
    }

    let product = await this.productRepository.createProduct(
      createProductDto,
      store,
    );
    product.files = fileUploaded;
    product = await this.productRepository.save(product);

    return product;
  }

  findAll() {
    return this.productRepository.find({ loadRelationIds: true });
  }

  async findOne(id: string) {
    return this.productRepository.findOne(id, {
      relations: ['store', 'files'],
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

  async updateProductImages(
    { product_id, toBeDeleted }: UpdateProductImagesDto,
    files: Express.Multer.File[],
  ): Promise<Product> {
    let product = await this.findOne(product_id);

    if (product && toBeDeleted) {
      const find_all_images = toBeDeleted.map(async (image) => {
        let img = null;

        img = await this.filesService.findOne(image);

        if (img) {
          console.log(img.id + ' encontrada!');
          await this.filesService.remove(img.id);
        }
      });

      await Promise.all(find_all_images);
      product = await this.findOne(product_id);

      await product.save();
      // return product;
    }

    if (product && files) {
      product = await this.findOne(product_id);
      const fileUploaded = product.files;
      const create_file_promises = await files.map(async (file) => {
        const currentFile = await this.filesService.createWithFile(file);
        fileUploaded.push(currentFile);
      });

      await Promise.all(create_file_promises);

      if (fileUploaded) {
        const save_file_promises = fileUploaded.map(async (file) => {
          await this.filesService.saveFile(file);
        });

        await Promise.all(save_file_promises);
      }

      product.files = fileUploaded;
      product = await this.productRepository.save(product);
    }

    return product;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
