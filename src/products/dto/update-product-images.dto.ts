export class UpdateProductImagesDto {
  product_id: string;
  toBeDeleted: Array<string>;
  toBeReplaced: Array<{ id: string }>;
}
