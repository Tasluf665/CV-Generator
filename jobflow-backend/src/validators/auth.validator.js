import Joi from 'joi';

export const register = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(6)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])'))
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter and one number',
    }),
  confirmPassword: Joi.any()
    .equal(Joi.ref('password'))
    .required()
    .messages({ 'any.only': 'Passwords do not match' }),
});

export const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const resendVerification = Joi.object({
  email: Joi.string().email().required(),
});

export const forgotPassword = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPassword = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])'))
    .required(),
  confirmPassword: Joi.any()
    .equal(Joi.ref('newPassword'))
    .required()
    .messages({ 'any.only': 'Passwords do not match' }),
});

export const updateProfile = Joi.object({
  firstName: Joi.string().min(2).max(50),
  lastName: Joi.string().min(2).max(50),
  avatar: Joi.string().uri(),
  preferences: Joi.object({
    theme: Joi.string().valid('light', 'dark'),
    defaultJobView: Joi.string().valid('list', 'grid'),
  }),
});
