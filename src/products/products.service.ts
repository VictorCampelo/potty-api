import { FindProductsDto } from './dto/find-products.dto';
import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesService } from 'src/files/files.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';
import { ProductRepository } from './products.repository';
import { UpdateProductImagesDto } from './dto/update-product-images.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { StoresService } from 'src/stores/stores.service';
import { Equal, LessThanOrEqual, MoreThanOrEqual, Not } from 'typeorm';
import { Order } from 'src/orders/order.entity';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
    private filesService: FilesService,
    @Inject(forwardRef(() => StoresService))
    private storesService: StoresService,
    private categoriesService: CategoriesService,
  ) {}

  async findMostSolds(
    storeId: string,
    startDate: Date,
    endDate: Date,
    limit?: number,
    offset?: number,
  ): Promise<Product[]> {
    try {
      const orders = await this.productRepository
        .createQueryBuilder('product')
        .select('product')
        .addSelect((subQuery) => {
          return subQuery
            .select('SUM(order.amount)')
            .from(Order, 'order')
            .where('order.productId = product.id')
            .andWhere('order.createdAt between :start and :end')
            .groupBy('order.productId');
        }, 'qtd')
        .setParameter('start', startDate)
        .setParameter('end', endDate)
        .where('product.store_id = :id')
        .andWhere('product.sumOrders > 0')
        .setParameter('start', startDate)
        .setParameter('end', endDate)
        .setParameter('id', storeId)
        .skip(offset)
        .take(limit)
        .groupBy('product.id')
        .getRawMany();
      return orders;
    } catch (error) {
      console.log(error);
    }
  }

  async amountSolds(
    storeId: string,
    startDate: Date,
    endDate: Date,
    limit?: number,
    offset?: number,
  ): Promise<number> {
    try {
      const orders = await this.productRepository
        .createQueryBuilder('product')
        .select('product.store_id')
        .addSelect((subQuery) => {
          return subQuery
            .select('SUM(order.amount)')
            .from(Order, 'order')
            .where('order.productId = product.id')
            .andWhere('order.createdAt between :start and :end')
            .groupBy('order.productId');
        }, 'qtd')
        .setParameter('start', startDate)
        .setParameter('end', endDate)
        .where('product.store_id = :id')
        .andWhere('product.sumOrders > 0')
        .setParameter('start', startDate)
        .setParameter('end', endDate)
        .setParameter('id', storeId)
        .skip(offset)
        .take(limit)
        .groupBy('product.id')
        .getRawMany();
      const result = orders
        .map((order) => order.qtd)
        .reduce((prev, next) => +prev + +next);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  create() {
    return this.productRepository.create();
  }

  async saveAll(products: Product[]) {
    return await this.productRepository.save(products);
  }

  async createProduct(
    createProductDto: CreateProductDto,
    storeId: string,
  ): Promise<Product> {
    const store = await this.storesService.findOne(storeId);
    const product = this.productRepository.create();

    product.title = createProductDto.title;
    product.price = createProductDto.price;
    product.inventory = createProductDto.inventory;
    product.tags = createProductDto.tags ? createProductDto.tags : null;
    product.description = createProductDto.description
      ? createProductDto.description
      : null;

    product.store = store;

    if (createProductDto.files) {
      product.files = await this.filesService.createFiles(
        createProductDto.files,
      );
    }

    if (createProductDto.categoriesIds) {
      product.categories = await this.categoriesService.findAllByIds(
        createProductDto.categoriesIds,
      );
    }

    if (createProductDto.discount) {
      product.discount = createProductDto.discount / 100;
    }

    return await product.save();
  }

  async findProductstByIds(ids: string[]) {
    return await this.productRepository.findByIds(ids);
  }

  async findAll(
    storeId: string,
    findProducts: FindProductsDto,
  ): Promise<Product[]> {
    let orderingBy;
    if (findProducts.options.loadLastSolds) {
      orderingBy = {
        lastSold: 'DESC',
      };
    } else {
      orderingBy = {
        sumOrders: 'ASC',
        avgStars: 'ASC',
      };
    }
    const whereOpt = {
      store: storeId,
    };
    if (findProducts.starsEq) {
      whereOpt['avgStars'] = Equal(findProducts.starsEq);
    } else if (findProducts.starsNeq) {
      whereOpt['avgStars'] = Not(findProducts.starsNeq);
    } else {
      if (findProducts.starsMax) {
        whereOpt['avgStars'] = LessThanOrEqual(findProducts.starsMax);
      }
      if (findProducts.starsMin) {
        whereOpt['avgStars'] = MoreThanOrEqual(findProducts.starsMin);
      }
    }

    return await this.productRepository.find({
      relations: findProducts.options.loadRelations ? ['files'] : [],
      where: whereOpt,
      skip: findProducts.options.offset ? findProducts.options.offset : 0,
      take: findProducts.options.limit ? findProducts.options.limit : 10,
      order: orderingBy,
    });
  }

  async findOne(id: string, findProducts?: FindProductsDto): Promise<Product> {
    const tables = [];
    const options = {};
    if (findProducts && findProducts.relations) {
      if (findProducts.relations.files) {
        tables.push('files');
      }
      if (findProducts.relations.store) {
        tables.push('store');
      }
      if (findProducts.relations.order) {
        tables.push('orders');
      }
      if (findProducts.relations.feedbacks) {
        tables.push('feedbacks');
      }
      if (findProducts.relations.feedbacksUser) {
        tables.push('feedbacks.user');
      }
      options['relations'] = tables;
    }
    return this.productRepository.findOne(id, options);
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
      if (product.files)
        product.files = await this.filesService.createFiles(files);
      else product.files.push(...(await this.filesService.createFiles(files)));
    }

    return await product.save();
  }

  async remove(id: string) {
    return await this.productRepository.softDelete(id);
  }
}
