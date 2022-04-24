import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FindCategoriesDto } from './dto/find-categories-dto';
import { FindCategoriesProductsDto } from './dto/find-categories-products-dto';
import { StoresService } from 'src/stores/stores.service';
export declare class CategoriesService {
    private readonly categoryRepository;
    private readonly storesService;
    constructor(categoryRepository: Repository<Category>, storesService: StoresService);
    create(createCategoryDto: CreateCategoryDto, typeOfCategory: string, storeId?: string): Promise<Category>;
    updateCategory(updateCategoryDto: UpdateCategoryDto, id: string): Promise<import("typeorm").UpdateResult>;
    findAll(): Promise<Category[]>;
    findAllByIds(ids: string[]): Promise<Category[]>;
    findAllByIdsTypeStore(ids: string[]): Promise<Category[]>;
    findStoresCategories(findCategoriesDto?: FindCategoriesDto): Promise<Category[]>;
    findProductsCategories(findCategoriesProductsDto: FindCategoriesProductsDto): Promise<Category[]>;
    findOne(id: string): Promise<Category>;
    update(findCategoriesProductsDto: FindCategoriesProductsDto, updateCategoryDto: UpdateCategoryDto): Promise<import("typeorm").UpdateResult>;
    remove(findCategoriesProductsDto: FindCategoriesProductsDto): Promise<import("typeorm").DeleteResult>;
    deleteStoreCategory(id: string): Promise<import("typeorm").DeleteResult>;
}
