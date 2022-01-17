import { Segments, Joi } from 'celebrate';

export const sendRecoverEmailValidation = {
  [Segments.BODY]: {
    email: Joi.string().email().required(),
  },
} as any;
