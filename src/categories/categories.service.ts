import { NotFoundException } from '@nestjs/common';
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  BadRequestException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FindCategoriesDto } from './dto/find-categories-dto';
import { FindCategoriesProductsDto } from './dto/find-categories-products-dto';
import { Store } from 'src/stores/store.entity';
import { StoresService } from 'src/stores/stores.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @Inject(forwardRef(() => StoresService))
    private readonly storesService: StoresService,
  ) {}
  async create(
    createCategoryDto: CreateCategoryDto,
    type: string,
    store?: Store,
  ) {
    const category = this.categoryRepository.create();
    category.name = createCategoryDto.name;
    category.type = type;
    if (type === 'product') {
      if (createCategoryDto.storeId) {
        category.storeProducts = await this.storesService.findOne(
          createCategoryDto.storeId,
        );
      } else {
        throw new BadRequestException();
      }
    }
    return this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({
      where: {
        type: 'store',
      },
    });
  }

  async findAllByIds(ids: string[]): Promise<Category[]> {
    return this.categoryRepository.findByIds(ids);
  }

  async findAllByIdsTypeStore(ids: string[]): Promise<Category[]> {
    return this.categoryRepository.find({
      where: {
        id: In(ids),
        type: 'store',
      },
    });
  }

  async findStoresCategories(
    findCategoriesDto?: FindCategoriesDto,
  ): Promise<Category[]> {
    const whereFind = {
      type: 'store',
    };
    if (findCategoriesDto.categoryId) {
      whereFind['id'] = findCategoriesDto.categoryId;
    }

    return this.categoryRepository.find({
      where: whereFind,
    });
  }

  async findProductsCategories(
    findCategoriesProductsDto: FindCategoriesProductsDto,
  ): Promise<Category[]> {
    const whereFind = {
      storeProducts: findCategoriesProductsDto.storeId,
      type: 'product',
    };
    if (findCategoriesProductsDto.categoryId) {
      whereFind['id'] = findCategoriesProductsDto.categoryId;
    }

    return this.categoryRepository.find({
      where: whereFind,
    });
  }

  async findOne(id: string) {
    return this.categoryRepository.findOne(id);
  }

  async update(
    findCategoriesProductsDto: FindCategoriesProductsDto,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.findProductsCategories(
      findCategoriesProductsDto,
    );
    if (!category) {
      throw new NotFoundException('category Not found');
    }
    category[0].name = updateCategoryDto.name;
    return this.categoryRepository.save(category);
  }

  async remove(findCategoriesProductsDto: FindCategoriesProductsDto) {
    const category = await this.findProductsCategories(
      findCategoriesProductsDto,
    );
    if (!category) {
      throw new NotFoundException('category Not found');
    }
    return this.categoryRepository.delete(category[0].id);
  }
}
