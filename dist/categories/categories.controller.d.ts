import { User } from 'src/users/user.entity';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAllPublicCategories(): Promise<import("./category.entity").Category[]>;
    createPublicCategory(createCategoryDto: CreateCategoryDto): Promise<import("./category.entity").Category>;
    updateCategory(updateCategoryDto: UpdateCategoryDto, id: string): Promise<import("typeorm").UpdateResult>;
    deleteCategory(id: string): Promise<import("typeorm").DeleteResult>;
    createProductStoreCategory(createCategoryDto: CreateCategoryDto, user: User): Promise<import("./category.entity").Category>;
    findAllProductsCategories(storeId: string): Promise<import("./category.entity").Category[]>;
    findOneStoresCategories(storeId: string, categoryId: string): Promise<import("./category.entity").Category[]>;
    update(storeId: string, categoryId: string, updateCategoryDto: UpdateCategoryDto): Promise<import("typeorm").UpdateResult>;
    remove(storeId: string, categoryId: string): Promise<import("typeorm").DeleteResult>;
}
