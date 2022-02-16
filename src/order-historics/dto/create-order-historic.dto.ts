export class CreateOrderHistoricDto {
  // orderHash!: string;

  storeId!: string;

  orderId!: string;

  productId!: string;

  productQtd!: number;

  productPrice!: number;

  customerId!: string;

  productParcels?: number;

  paymentMethod: string;
}
