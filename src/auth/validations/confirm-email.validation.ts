import { Segments, Joi } from 'celebrate';
export const confirmaEmailValidation = {
  [Segments.PARAMS]: {
    token: Joi.string().required(),
  },
} as any;
