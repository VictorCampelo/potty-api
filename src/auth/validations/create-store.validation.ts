import { Joi, Segments } from 'celebrate';

const createUserStoreValidation = {
  [Segments.BODY]: {
    avatar: Joi.optional(),
    storeDto: Joi.object()
      .keys({
        name: Joi.string().required(),
        CNPJ: Joi.string().required(),
        phone: Joi.string().optional(),
        address: Joi.string().optional(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        description: Joi.string().optional(),
        facebook_link: Joi.string().optional(),
        instagram_link: Joi.string().optional(),
        whatsapp_link: Joi.string().optional(),
      })
      .required(),
    userDto: Joi.object().keys({
      email: Joi.string().email().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      password: Joi.string().required(),
      passwordConfirmation: Joi.string()
        .required()
        .when('password', { then: Joi.equal(Joi.ref('password')) }),
    }),
  },
} as any;

export { createUserStoreValidation };
