interface Order {
  storeId: string;
  orderProducts: {
    productId: string;
    amount: number;
  }[];
}

export class CreateOrderDto {
  products: Order[];
  couponCode?: string;
}
