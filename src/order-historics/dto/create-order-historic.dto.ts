export class CreateOrderHistoricDto {
  // orderHash!: string;

  orderId!: string;

  productId!: string;

  productQtd!: number;

  productPrice!: number;

  productParcels?: number;
}
