import { StoresService } from './../stores/stores.service';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { FindCategoriesDto } from './dto/find-categories-dto';
import { FindCategoriesProductsDto } from './dto/find-categories-products-dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async createProductCategory(
    createProductCategoryDto: CreateProductCategoryDto,
  ) {
    const store = createProductCategoryDto.store;
    const name = createProductCategoryDto.name;
    const category = this.categoryRepository.create({ name: name });

    category.storeProducts = store;

    return await this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async findAllByIds(ids: string[]): Promise<Category[]> {
    return await this.categoryRepository.findByIds(ids);
  }

  async findAllByIdsTypeStore(ids: string[]): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: {
        id: In(ids),
        type: 'store',
      },
    });
  }

  async findStoresCategories(
    findCategoriesDto: FindCategoriesDto,
  ): Promise<Category[]> {
    const whereFind = {
      type: 'store',
    };
    if (findCategoriesDto.categoryId) {
      whereFind['id'] = findCategoriesDto.categoryId;
    }

    return await this.categoryRepository.find({
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
    console.log(whereFind);

    return await this.categoryRepository.find({
      where: whereFind,
    });
  }

  async findOne(id: string) {
    return await this.categoryRepository.findOne(id);
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
