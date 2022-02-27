import { CreateOrderDto } from "src/orders/dto/create-order.dto";

export default class PayloadUtils{
  static giveMeAValidCreateOrderWithDiscountPayload(
    coupon?: string,
  ): CreateOrderDto {
    const payload: CreateOrderDto = {
      products: [
        {
          storeId: '1',
          orderProducts: [
            {
              productId: '3',
              amount: 3,
              paymentMethod: 'boleto',
            },
          ],
        },
        {
          storeId: '2',
          orderProducts: [
            {
              productId: '4',
              amount: 2,
              paymentMethod: 'pix',
            },
          ],
        },
      ],
      couponCode: coupon,
    };

    return payload;
  }

  static giveMeAValidCreateOrderPayload(coupon?: string): CreateOrderDto {
    const payload: CreateOrderDto = {
      products: [
        {
          storeId: '1',
          orderProducts: [
            {
              productId: '2',
              amount: 3,
              paymentMethod: 'visa',
            },
          ],
        },
      ],
      couponCode: coupon,
    };

    return payload;
  }
}
