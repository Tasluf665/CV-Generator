export const validate = (schema) => (req, res, next) => {
  // Logic to validate request body/params against schema
  // If fails, throw ApiError
  next();
};
