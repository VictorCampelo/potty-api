import { Segments, Joi } from 'celebrate';

export const updateProductValidation = {
  [Segments.PARAMS]: {
    id: Joi.string().required().uuid(),
  },
  [Segments.BODY]: {
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    inventory: Joi.number().optional().min(0),
    categoriesIds: Joi.array().items(Joi.string()).optional(),
  },
} as any;
