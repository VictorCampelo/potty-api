/// <reference types="multer" />
export declare class UpdateProductImagesDto {
    product_id: string;
    toBeDeleted: Array<string>;
    files: Express.Multer.File[];
}
