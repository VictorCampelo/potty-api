"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PayloadUtils {
    static giveMeAValidCreateOrderWithDiscountPayload(coupon) {
        const payload = {
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
    static giveMeAValidCreateOrderPayload(coupon) {
        const payload = {
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
exports.default = PayloadUtils;
//# sourceMappingURL=payload.js.map