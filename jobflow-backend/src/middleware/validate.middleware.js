import { ApiError } from '../utils/ApiError.js';

export const validate = (schema) => (req, res, next) => {
  if (!schema) {
    return next();
  }

  const { value, error } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(', ');
    return next(new ApiError(400, errorMessage));
  }

  req.body = value;
  next();
};
