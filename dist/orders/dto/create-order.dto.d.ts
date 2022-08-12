interface IUserAddress {
    uf: string;
    zipcode: string;
    city: string;
    street: string;
    neighborhood: string;
    addressNumber: string;
    logradouro?: string;
    complement?: string;
}
interface IProducts {
    productId: string;
    amount: number;
    paymentMethod: string;
    parcels?: number;
}
interface IOrder {
    storeId: string;
    orderProducts: IProducts[];
    delivery?: boolean;
}
export declare class CreateOrderDto {
    products: IOrder[];
    couponCode?: string;
    guestAddress?: IUserAddress;
}
export interface IProductsToListMsg {
    amount: number;
    title: string;
    parcels?: number;
    paymentMethod: string;
}
export {};
