import { Segments, Joi } from 'celebrate';
export const createUserValidation = {
  [Segments.BODY]: {
    email: Joi.string().email().required().max(200),
    firstName: Joi.string().required().max(200),
    lastName: Joi.string().required().max(200),
    password: Joi.string().required().min(6),
    passwordConfirmation: Joi.string()
      .required()
      .when('password', { then: Joi.equal(Joi.ref('password')) }),
    zipcode: Joi.string().optional(),
    street: Joi.string().optional(),
    addressNumber: Joi.number().optional(),
    neighborhood: Joi.string().optional(),
    complement: Joi.string().optional(),
    city: Joi.string().optional(),
    uf: Joi.string().optional(),
    logradouro: Joi.string().optional(),
  },
} as any;
