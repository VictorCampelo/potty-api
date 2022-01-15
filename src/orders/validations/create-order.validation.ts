import { Joi, Segments } from 'celebrate';

export const createOrderValidation = {
  [Segments.BODY]: {
    products: Joi.array().items(
      Joi.object().keys({
        storeId: Joi.string().required().uuid(),
        orderProducts: Joi.array().items(
          Joi.object().keys({
            productId: Joi.string().required().uuid(),
            amount: Joi.number().required(),
            parcels: Joi.number(),
          }),
        ),
        delivery: Joi.boolean(),
      }),
    ),
    couponCode: Joi.string(),
  },
} as any;
