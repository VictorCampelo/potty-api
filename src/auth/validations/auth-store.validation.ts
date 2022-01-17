import { Segments, Joi } from 'celebrate';

export const authStoreValidation = {
  [Segments.BODY]: {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  },
} as any;
