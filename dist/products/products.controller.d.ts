/// <reference types="multer" />
import { FindProductsDto } from './dto/find-products.dto';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateProductImagesDto } from './dto/update-product-images.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { User } from 'src/users/user.entity';
import { FindPromotedDto } from './dto/find-promoted.dto';
import { UniqueUpdateDto } from './dto/unique-update.dto';
import { Request } from 'express';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findRelatedProducts(request: Request, relatedDto: {
        categoryId: string;
        productName: string;
        storeId: string;
        take: number;
        page: number;
    }): Promise<{
        statusCode: string;
        data: any[];
        count: any;
        currentPage: any;
        nextPage: any;
        prevPage: number;
        lastPage: any;
    }>;
    findWithDiscount(findPromotedDto: FindPromotedDto): Promise<{
        statusCode: string;
        data: any[];
        count: any;
        currentPage: any;
        nextPage: any;
        prevPage: number;
        lastPage: any;
    }>;
    findFromCategory(categoryId: string, fromCategoryDto: {
        take: number;
        page: number;
    }): Promise<{
        statusCode: string;
        data: any[];
        count: any;
        currentPage: any;
        nextPage: any;
        prevPage: number;
        lastPage: any;
    }>;
    findOne(id: string, query: FindProductsDto): Promise<import("./product.entity").Product>;
    findAllProduct(storeId: string, findProductsDto: FindProductsDto): Promise<{
        statusCode: string;
        data: any[];
        count: any;
        currentPage: any;
        nextPage: any;
        prevPage: number;
        lastPage: any;
    }>;
    create(createProductDto: CreateProductDto, user: User, images?: Express.Multer.File[]): Promise<{
        product: import("./product.entity").Product;
        message: string;
    }>;
    updateProductDetails(id: string, updateProductDto: UpdateProductDto): Promise<{
        product: import("typeorm").UpdateResult;
        message: string;
    }>;
    updateProductImages(id: string, updateProductImagesDto: UpdateProductImagesDto, images: Express.Multer.File[]): Promise<{
        product: import("./product.entity").Product;
        message: string;
    }>;
    updateProduct(id: string, uniqueUpdateDto: UniqueUpdateDto, images: Express.Multer.File[]): Promise<{
        product: import("typeorm").UpdateResult;
        message: string;
    }>;
    remove(id: string): Promise<import("typeorm").UpdateResult>;
}
