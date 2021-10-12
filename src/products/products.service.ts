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
import {
  Equal,
  getManager,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
} from 'typeorm';
import { Order } from 'src/orders/order.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
    private filesService: FilesService,
    @Inject(forwardRef(() => StoresService))
    private storesService: StoresService,
  ) {}

  //   SELECT "product"."id" AS "product_id", "product"."title" AS "product_title", "product"."description" AS "product_description", "product"."tags" AS "product_tags", "product"."price" AS "product_price", "product"."sumOrders" AS "product_sumOrders", "product"."sumFeedbacks" AS "product_sumFeedbacks", "product"."sumStars"
  // AS "product_sumStars", "product"."avgStars" AS "product_avgStars", "product"."lastSold" AS "product_lastSold", "product"."createdAt" AS "product_createdAt", "product"."updatedAt" AS "product_updatedAt", "product"."deletedAt" AS "product_deletedAt", "product"."store_id" AS "product_store_id", "orders"."orderid" AS "orders_orderid", "orders"."amount" AS "orders_amount", "orders"."createdAt" AS "orders_createdAt", "orders"."updatedAt" AS "orders_updatedAt", "orders"."userId" AS "orders_userId", "orders"."productId" AS "orders_productId", "store"."id" AS "store_id", "store"."name" AS "store_name", "store"."CNPJ" AS "store_CNPJ", "store"."phone" AS "store_phone", "store"."address" AS "store_address", "store"."city" AS "store_city", "store"."state" AS "store_state", "store"."description" AS "store_description", "store"."enabled" AS "store_enabled", "store"."sumOrders" AS "store_sumOrders", "store"."sumFeedbacks" AS "store_sumFeedbacks", "store"."sumStars" AS "store_sumStars", "store"."avgStars" AS "store_avgStars", "store"."facebook_link" AS "store_facebook_link", "store"."instagram_link" AS "store_instagram_link", "store"."whatsapp_link" AS "store_whatsapp_link", "store"."createdAt" AS "store_createdAt", "store"."updatedAt" AS "store_updatedAt", "store"."likes" AS "store_likes", COUNT("orders"."orderid") AS "qtd" FROM "product" "product" LEFT JOIN "order" "orders" ON "orders"."productId"="product"."id"  LEFT JOIN "store" "store" ON "store"."id"="product"."store_id" WHERE "product"."deletedAt" IS NULL GROUP BY "orders"."productId"

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
        tables.push('order');
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
