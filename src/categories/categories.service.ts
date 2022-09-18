import {
  Injectable,
  BadRequestException,
  forwardRef,
  Inject,
  NotFoundException,
  HttpException,
  HttpStatus,
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
    private readonly categoryRepository: Repository<Category>,
    @Inject(forwardRef(() => StoresService))
    private readonly storesService: StoresService,
  ) {}
  async create(
    createCategoryDto: CreateCategoryDto,
    typeOfCategory: string,
    storeId?: string,
  ) {
    const category = this.categoryRepository.create();
    category.name = createCategoryDto.name;
    category.type = typeOfCategory;
    if (typeOfCategory === 'product') {
      category.storeProductsId = storeId;
    }
    return this.categoryRepository.save(category);
  }

  async updateCategory(updateCategoryDto: UpdateCategoryDto, id: string) {
    const category = await this.categoryRepository.findOne(id, {
      where: {
        type: 'store',
      },
    });

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    return this.categoryRepository.update(category.id, updateCategoryDto);
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
  ) {
    const whereFind = {
      storeProductsId: findCategoriesProductsDto.storeId,
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
    return this.categoryRepository.update(
      {
        id: findCategoriesProductsDto.categoryId,
        storeProductsId: findCategoriesProductsDto.storeId,
      },
      updateCategoryDto,
    );
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

  async deleteStoreCategory(id: string) {
    return this.categoryRepository.delete(id);
  }
}
