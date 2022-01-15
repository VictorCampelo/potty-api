import { Segments, Joi } from 'celebrate';

export const changePlanValidation = {
  [Segments.BODY]: {
    planId: Joi.string().required().uuid(),
    userId: Joi.string().required().uuid(),
  },
} as any;
