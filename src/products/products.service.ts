import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import camelcaseKeys from 'camelcase-keys';
import _ from 'lodash';
import { CategoriesService } from 'src/categories/categories.service';
import { FilesService } from 'src/files/files.service';
import { StoresService } from 'src/stores/stores.service';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import {
  Equal,
  getConnection,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductsDto } from './dto/find-products.dto';
import { UpdateProductImagesDto } from './dto/update-product-images.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly filesService: FilesService,
    @Inject(forwardRef(() => StoresService))
    private readonly storesService: StoresService,
    private readonly categoriesService: CategoriesService,
    private readonly usersService: UsersService,
  ) {}

  async amountSolds(
    storeId: string,
    startDate: Date,
    endDate: Date,
    limit?: number,
    offset?: number,
  ) {
    const params: any = [storeId, startDate, endDate];

    let query = `
    select distinct
      ohp."productId",
      ohp.qtd
    from
      product p, (
      select
        oh."productId",
        p.store_id,
        sum(oh."productQtd") as qtd
      from
        "order-historic" oh
      inner join 
        product p on p.id = oh."productId"
      where 
        oh."updatedAt" >= $2 and oh."updatedAt" <= $3
      group by oh."productId", p.store_id ) as ohp
    where ohp.store_id = $1 
    `;

    if (offset) {
      params.push(offset);
      query += `offset $${params.length} `;
    }

    if (limit) {
      params.push(limit);
      query += `limit $${params.length} `;
    }

    const products = await getConnection().query(query, params);

    return camelcaseKeys(products);
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
    const userWithPlan = await this.usersService.findUserById(user.id);

    const productAmount = await this.findAll(user.storeId, {});

    if (
      !userWithPlan.plan ||
      userWithPlan.plan.qtd_products <= productAmount.length
    ) {
      throw new HttpException(
        "You don't have a plan or your Products limit has expired",
        HttpStatus.BAD_REQUEST,
      );
    }

    const store = await this.storesService.findOneByUser(user.id);
    const product = this.productRepository.create();

    product.discount = createProductDto.discount;
    product.title = createProductDto.title;
    product.price = createProductDto.price;
    product.inventory = createProductDto.inventory;
    product.parcelAmount = createProductDto.parcelAmount;
    product.tags = createProductDto.tags ? createProductDto.tags : null;
    product.description = createProductDto.description
      ? createProductDto.description
      : null;

    product.store = store;

    if (createProductDto.files) {
      product.files = await this.filesService.uploadMultipleFilesToS3(
        createProductDto.files,
        `${store.name}/${product.title}`,
      );
    }

    if (
      createProductDto.categoriesIds.length &&
      createProductDto.categoriesIds[0].length > 0
    ) {
      product.categories = await this.categoriesService.findAllByIds(
        createProductDto.categoriesIds,
      );
    }

    return product.save();
  }

  async findProductstByIds(ids: string[]) {
    return this.productRepository.findByIds(ids);
  }

  async findProductstByIdsAndStoreId(ids: string[], storeId: string) {
    return this.productRepository.findByIds(ids, {
      where: {
        storeId,
      },
      relations: ['categories'],
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
    } else if (findProducts.loadLastCreated) {
      orderingBy = {
        createdAt: 'DESC',
      };
    } else {
      orderingBy = {
        sumOrders: 'ASC',
        avgStars: 'ASC',
      };
    }
    const whereOpt = {
      storeId: storeId,
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
    if (updateProductDto.categoriesIds) {
      const product = await this.productRepository.findOne(id);

      product.categories = await this.categoriesService.findAllByIds(
        updateProductDto.categoriesIds,
      );

      updateProductDto = _.omit(updateProductDto, 'categoriesIds');

      await product.save();
    }

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
    const product = await this.findOne(product_id, {
      store: true,
      files: true,
    });

    if (!product) {
      throw new NotFoundException(
        "The product_id sent doesn't matches any product on the database.",
      );
    }

    if (toBeDeleted) {
      await this.filesService.remove(toBeDeleted, product.files);
    }

    if (files) {
      if (product.files && product.files.length === 0) {
        product.files = await this.filesService.uploadMultipleFilesToS3(
          files,
          `${product.store.name}/${product.title}`,
        );
      } else {
        const uploadedFiles = await this.filesService.uploadMultipleFilesToS3(
          files,
          `${product.store.name}/${product.title}`,
        );
        product.files = [];
        product.files.push(...uploadedFiles);
      }
    }

    return product.save();
  }

  async remove(id: string) {
    return this.productRepository.softDelete(id);
  }

  async findWithDiscount() {
    return this.productRepository.find({
      where: {
        discount: MoreThan(0),
      },
      order: { discount: 'DESC' },
    });
  }

  async findRelated({
    categoryId,
    productName,
  }: {
    categoryId: string;
    productName: string;
  }) {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'categories')
      .leftJoinAndSelect('product.files', 'files')
      .where('categories.id = :id', { id: categoryId })
      .orWhere('product.title LIKE :title', { title: `%${productName}%` })
      .getMany();

    const productsWithDifferentCategories = products.filter((product) =>
      product.categories.every((category) => category.id !== categoryId),
    );

    const productsByCategory = products.filter(
      (product) => !productsWithDifferentCategories.includes(product),
    );

    return { productsByCategory, productsWithDifferentCategories };
  }

  async findFromCategory(categoryId: string) {
    return this.productRepository
      .createQueryBuilder('product')
      .innerJoinAndSelect('product.categories', 'categories')
      .where('categories.id = :category', {
        category: categoryId,
      })
      .getMany();
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
      .getRawMany();
  }
}
