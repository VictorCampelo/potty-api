import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { FilesService } from 'src/files/files.service';
import { StoresService } from 'src/stores/stores.service';
import { User } from 'src/users/user.entity';
import { Equal, LessThanOrEqual, MoreThanOrEqual, Not } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductsDto } from './dto/find-products.dto';
import { UpdateProductImagesDto } from './dto/update-product-images.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';
import { ProductRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductRepository)
    private readonly productRepository: ProductRepository,
    private readonly filesService: FilesService,
    @Inject(forwardRef(() => StoresService))
    private readonly storesService: StoresService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async amountSolds(
    storeId: string,
    startDate: Date,
    endDate: Date,
    limit?: number,
    offset?: number,
  ) {
    return this.productRepository
      .createQueryBuilder('product')
      .innerJoinAndSelect('product.orderHistorics', 'historic')
      .select('product')
      .addSelect('sum(historic.productQtd)', 'qtd')
      .where('product.store_id = :id', { id: storeId })
      .andWhere('product.sumOrders > 0')
      .andWhere(
        `historic.createdAt
          BETWEEN :begin
          AND :end`,
        { begin: startDate, end: endDate },
      )
      .skip(offset)
      .take(limit)
      .groupBy('product.id')
      .getMany();
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

  async findProductstByIdsAndStoreId(ids: string[], storeId: string) {
    return this.productRepository.findByIds(ids, {
      where: {
        store: storeId,
      },
    });
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
        tables.push('orderHistorics');
        tables.push('orderHistorics.orders');
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

  async updateProductDetails(id: string, updateProductDto: UpdateProductDto) {
    return this.productRepository.update(id, updateProductDto);
  }

  async saveProducts(products: Product[]) {
    return this.productRepository.save(products);
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
      if (product.files && product.files.length === 0) {
        product.files = await this.filesService.createFiles(files);
      } else {
        product.files = [];
        product.files.push(...(await this.filesService.createFiles(files)));
      }
    }

    return product.save();
  }

  async remove(id: string) {
    return this.productRepository.softDelete(id);
  }

  async productsSold(
    storeId: string,
    startDate: Date,
    endDate: Date,
    limit?: number,
    offset?: number,
  ) {
    return this.productRepository
      .createQueryBuilder('product')
      .innerJoinAndSelect('product.orderHistorics', 'historic')
      .select('product')
      .addSelect('sum(historic.productQtd)', 'qtd')
      .where('product.store_id = :id', { id: storeId })
      .andWhere('product.sumOrders > 0')
      .andWhere(
        `historic.createdAt
          BETWEEN :begin
          AND :end`,
        { begin: startDate, end: endDate },
      )
      .skip(offset)
      .take(limit)
      .groupBy('product.id')
      .getMany();
  }
}
