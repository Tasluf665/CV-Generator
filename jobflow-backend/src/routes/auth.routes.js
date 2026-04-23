import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import * as authValidator from '../validators/auth.validator.js';

const router = express.Router();

// Public routes
router.post('/register', validate(authValidator.register), authController.register);
router.get('/verify-email', authController.verifyEmail);
router.post('/resend-verification', validate(authValidator.resendVerification), authController.resendVerification);
router.post('/login', validate(authValidator.login), authController.login);
router.post('/refresh', authController.refresh);
router.post('/forgot-password', validate(authValidator.forgotPassword), authController.forgotPassword);
router.post('/reset-password', validate(authValidator.resetPassword), authController.resetPassword);

// Protected routes
router.post('/logout', verifyJWT, authController.logout);
router.get('/me', verifyJWT, authController.me);
router.patch('/update-profile', verifyJWT, validate(authValidator.updateProfile), authController.updateProfile);

export default router;
