/// <reference types="multer" />
export declare class UniqueUpdateDto {
    product_id?: string;
    toBeDeleted?: Array<string>;
    title?: string;
    description?: string;
    tags?: string[];
    categoriesIds?: string[];
    files?: Express.Multer.File[];
    price?: number;
    inventory: number;
    discount?: number;
    parcelAmount?: number;
}
