import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

export const generateAccessToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    ENV.JWT_SECRET,
    { expiresIn: ENV.JWT_EXPIRY }
  );
};

export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    ENV.JWT_REFRESH_SECRET || ENV.JWT_SECRET,
    { expiresIn: ENV.JWT_REFRESH_EXPIRY || '7d' }
  );
};
