import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY || '1d',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'refresh_secret_fallback', // I'll use a fallback if not provided
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '7d',
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_APP_PASSWORD: process.env.EMAIL_APP_PASSWORD,
  EMAIL_TOKEN_EXPIRATION_TIME: process.env.EMAIL_TOKEN_EXPIRATION_TIME || '10m',
};

// Validate critical env variables
const requiredEnvs = ['MONGO_URI', 'JWT_SECRET', 'EMAIL_USER', 'EMAIL_APP_PASSWORD'];
requiredEnvs.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`[WARNING]: Missing required environment variable: ${key}`);
  }
});
