import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
export default class PayloadUtils {
    static giveMeAValidCreateOrderWithDiscountPayload(coupon?: string): CreateOrderDto;
    static giveMeAValidCreateOrderPayload(coupon?: string): CreateOrderDto;
}
