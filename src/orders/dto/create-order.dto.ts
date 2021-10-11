interface Order {
  productId: string;
  amount: number;
}

export class CreateOrderDto {
  products: Order[];
}
