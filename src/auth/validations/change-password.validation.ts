import { Joi, Segments } from 'celebrate';

export const changePasswordValidation = {
  [Segments.PARAMS]: {
    id: Joi.string().required().uuid(),
  },
  [Segments.BODY]: {
    password: Joi.string()
      .required()
      .min(6)
      .regex(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/),
    passwordConfirmation: Joi.string()
      .required()
      .when('password', { then: Joi.equal(Joi.ref('password')) }),
  },
} as any;
