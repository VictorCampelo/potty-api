import { Segments, Joi } from 'celebrate';

export const findProductsValidation = {
  [Segments.PARAMS]: {
    id: Joi.string().required().uuid(),
  },
  [Segments.QUERY]: {
    limit: Joi.number().optional(),
    offset: Joi.number().optional(),
    loadRelations: Joi.boolean().optional(),
    loadLastSolds: Joi.boolean().optional(),
    loadLastCreated: Joi.boolean().optional(),
    files: Joi.boolean().optional(),
    categories: Joi.boolean().optional(),
    store: Joi.boolean().optional(),
    order: Joi.boolean().optional(),
    feedbacks: Joi.boolean().optional(),
    feedbacksUser: Joi.boolean().optional(),
    starsMax: Joi.number().optional(),
    starsMin: Joi.number().optional(),
    starsEq: Joi.number().optional(),
    starsNeq: Joi.number().optional(),
  },
} as any;
