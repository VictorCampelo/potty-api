import { Joi, Segments } from 'celebrate';
const createProductValidation = {
  [Segments.BODY]: {
    title: Joi.string().required(),
    price: Joi.number().required(),
    description: Joi.string().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    inventory: Joi.number().required().min(0),
    files: Joi.optional(),
    categoriesIds: Joi.array().items(Joi.string()).optional(),
    discount: Joi.number().optional().min(0).max(100),
    parcelAmount: Joi.number().optional().min(1),
  },
} as any;

export { createProductValidation };
