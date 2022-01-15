interface IProducts {
  productId: string;
  amount: number;
  parcels?: number;
}
interface IOrder {
  storeId: string;
  orderProducts: IProducts[];
  delivery?: boolean;
}

export class CreateOrderDto {
  products: IOrder[];
  couponCode?: string;
}

export interface IProductsToListMsg {
  amount: number;
  title: string;
  parcels?: number;
}
