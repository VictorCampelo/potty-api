/// <reference types="multer" />
export declare class CreateProductDto {
    title: string;
    price: number;
    description?: string;
    tags?: string[];
    inventory: number;
    files?: Express.Multer.File[];
    categoriesIds?: string[];
    discount?: number;
    parcelAmount?: number;
}
