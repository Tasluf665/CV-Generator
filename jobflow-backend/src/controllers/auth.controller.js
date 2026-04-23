import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as authService from '../services/auth.service.js';
import { ENV } from '../config/env.js';

const cookieOptions = {
  httpOnly: true,
  secure: ENV.NODE_ENV === 'production',
  sameSite: 'Strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);

  return res.status(201).json(
    new ApiResponse(201, result, 'Account created. Please check your email to verify your account.')
  );
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;
  await authService.verifyUserEmail(token);

  return res.status(200).json(new ApiResponse(200, null, 'Email verified successfully. You can now log in.'));
});

export const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;
  await authService.resendUserVerification(email);

  return res.status(200).json(new ApiResponse(200, null, 'Verification email resent. Please check your inbox.'));
});

export const login = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken, user } = await authService.loginUser(req.body);

  res.cookie('refreshToken', refreshToken, cookieOptions);

  return res.status(200).json(
    new ApiResponse(
      200,
      { accessToken, user },
      'Login successful.'
    )
  );
});

export const refresh = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;
  const { accessToken, newRefreshToken } = await authService.refreshUserToken(incomingRefreshToken);

  res.cookie('refreshToken', newRefreshToken, cookieOptions);

  return res.status(200).json(new ApiResponse(200, { accessToken }, 'Token refreshed.'));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  await authService.processForgotPassword(email);

  return res.status(200).json(new ApiResponse(200, null, 'If this email is registered, a reset link has been sent.'));
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  await authService.resetUserPassword(token, newPassword);

  return res.status(200).json(new ApiResponse(200, null, 'Password reset successful. Please log in with your new password.'));
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logoutUser(req.user._id);

  res.clearCookie('refreshToken', cookieOptions);

  return res.status(200).json(new ApiResponse(200, null, 'Logged out successfully.'));
});

export const me = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user, 'User profile fetched.'));
});

export const updateProfile = asyncHandler(async (req, res) => {
  // Pass current user preferences to the service for merging if needed
  const updateData = { ...req.body };
  if (req.body.preferences) {
    updateData.preferences = { ...req.user.preferences, ...req.body.preferences };
  }
  
  const updatedUser = await authService.updateUserProfile(req.user._id, updateData);

  return res.status(200).json(new ApiResponse(200, updatedUser, 'Profile updated successfully.'));
});

