import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export const verifyJWT = asyncHandler(async (req, _, next) => {
  // Logic to verify JWT from Authorization header
  // req.user = user;
  next();
});
