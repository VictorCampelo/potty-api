import { CategoriesService } from 'src/categories/categories.service';
import { FileStorageProvider as FilesService } from './../files/providers/fileStorage.provider';
import { StoresService } from 'src/stores/stores.service';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductsDto } from './dto/find-products.dto';
import { FindPromotedDto } from './dto/find-promoted.dto';
import { UniqueUpdateDto } from './dto/unique-update.dto';
import { UpdateProductImagesDto } from './dto/update-product-images.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';
export declare class ProductsService {
    private readonly productRepository;
    private readonly filesService;
    private readonly storesService;
    private readonly categoriesService;
    private readonly usersService;
    constructor(productRepository: Repository<Product>, filesService: FilesService, storesService: StoresService, categoriesService: CategoriesService, usersService: UsersService);
    amountSolds(storeId: string, startDate: Date, endDate: Date, limit?: number, offset?: number): Promise<any>;
    create(): Product;
    saveAll(products: Product[]): Promise<Product[]>;
    createProduct(createProductDto: CreateProductDto, user: User): Promise<Product>;
    findProductstByIds(ids: string[]): Promise<Product[]>;
    findProductstByIdsAndStoreId(ids: string[], storeId: string): Promise<Product[]>;
    findAll(storeId: string, findProducts: FindProductsDto): Promise<{
        statusCode: string;
        data: any[];
        count: any;
        currentPage: any;
        nextPage: any;
        prevPage: number;
        lastPage: any;
    }>;
    findOne(id: string, findProducts?: FindProductsDto): Promise<Product>;
    updateProductDetails(id: string, updateProductDto: UpdateProductDto): Promise<import("typeorm").UpdateResult>;
    saveProducts(products: Product[]): Promise<Product[]>;
    updateProductImages({ product_id, toBeDeleted, files, }: UpdateProductImagesDto): Promise<Product>;
    updateProduct(updateProductDto: UniqueUpdateDto): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<import("typeorm").UpdateResult>;
    findWithDiscount(findPromotedDto: FindPromotedDto): Promise<{
        statusCode: string;
        data: any[];
        count: any;
        currentPage: any;
        nextPage: any;
        prevPage: number;
        lastPage: any;
    }>;
    findRelatedMarketplace({ categoryId, productName, storeId, take, page, }: {
        categoryId: string;
        productName: string;
        storeId?: string;
        take?: number;
        page?: number;
    }): Promise<{
        statusCode: string;
        data: any[];
        count: any;
        currentPage: any;
        nextPage: any;
        prevPage: number;
        lastPage: any;
    }>;
    findRelatedCatalog({ categoryId, productName, storeId, take, page, }: {
        categoryId: string;
        productName: string;
        storeId: string;
        take?: number;
        page?: number;
    }): Promise<{
        statusCode: string;
        data: any[];
        count: any;
        currentPage: any;
        nextPage: any;
        prevPage: number;
        lastPage: any;
    }>;
    findFromCategory(categoryId: string, { take, page, }: {
        take?: number;
        page?: number;
    }): Promise<{
        statusCode: string;
        data: any[];
        count: any;
        currentPage: any;
        nextPage: any;
        prevPage: number;
        lastPage: any;
    }>;
    productsSold(storeId: string, startDate: Date, endDate: Date, limit?: number, offset?: number): Promise<any[]>;
}
export declare function paginateResponse(data: any, page: any, limit: any): {
    statusCode: string;
    data: any[];
    count: any;
    currentPage: any;
    nextPage: any;
    prevPage: number;
    lastPage: any;
};
