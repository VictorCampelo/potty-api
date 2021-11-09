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
import { User } from 'src/users/user.entity';

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
    return this.productRepository
      .createQueryBuilder('product')
      .select('product')
      .addSelect(this.sumOrderAmount(), 'qtd')
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
  }

  private sumOrderAmount() {
    return (subQuery) =>
      subQuery
        .select('SUM(order.amount)')
        .from(Order, 'order')
        .where('order.productId = product.id')
        .andWhere('order.createdAt between :start and :end')
        .groupBy('order.productId');
  }

  async amountSolds(
    storeId: string,
    startDate: Date,
    endDate: Date,
    limit?: number,
    offset?: number,
  ): Promise<number> {
    const orders = await this.productRepository
      .createQueryBuilder('product')
      .select('product.store_id')
      .addSelect(this.sumOrderAmount(), 'qtd')
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
    return orders
      .map((order) => order.qtd)
      .reduce((prev, next) => +prev + +next);
  }

  create() {
    return this.productRepository.create();
  }

  async saveAll(products: Product[]) {
    return this.productRepository.save(products);
  }

  async createProduct(
    createProductDto: CreateProductDto,
    user: User,
  ): Promise<Product> {
    const store = await this.storesService.findOneByUser(user.id);
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

    return product.save();
  }

  async findProductstByIds(ids: string[]) {
    return this.productRepository.findByIds(ids);
  }

  async findAll(
    storeId: string,
    findProducts: FindProductsDto,
  ): Promise<Product[]> {
    let orderingBy;
    if (findProducts.loadLastSolds) {
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

    return this.productRepository.find({
      relations: findProducts.loadRelations ? ['files', 'categories'] : [],
      where: whereOpt,
      skip: findProducts.offset ? findProducts.offset : 0,
      take: findProducts.limit ? findProducts.limit : 10,
      order: orderingBy,
    });
  }

  async findOne(id: string, findProducts?: FindProductsDto): Promise<Product> {
    const tables = [];
    const options = {};
    if (findProducts) {
      if (findProducts.files) {
        tables.push('files');
      }
      if (findProducts.store) {
        tables.push('store');
      }
      if (findProducts.order) {
        tables.push('orders');
      }
      if (findProducts.feedbacks) {
        tables.push('feedbacks');
      }
      if (findProducts.categories) {
        tables.push('categories');
      }
      if (findProducts.feedbacksUser) {
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

    return this.productRepository.save(product);
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
      if (product.files.length === 0) {
        product.files = await this.filesService.createFiles(files);
      } else {
        product.files.push(...(await this.filesService.createFiles(files)));
      }
    }

    return product.save();
  }

  async remove(id: string) {
    return this.productRepository.softDelete(id);
  }
}
