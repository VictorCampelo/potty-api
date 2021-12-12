interface IProducts {
  productId: string;
  amount: number;
}
interface IOrder {
  storeId: string;
  orderProducts: IProducts[];
}

export class CreateOrderDto {
  products: IOrder[];
  couponCode?: string;
}
