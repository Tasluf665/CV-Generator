import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail } from '../services/email.service.js';
import { ENV } from '../config/env.js';

const cookieOptions = {
  httpOnly: true,
  secure: ENV.NODE_ENV === 'production',
  sameSite: 'Strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, 'User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    emailVerificationToken: hashedToken,
    emailVerificationTokenExpiry: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  });

  await sendVerificationEmail(email, firstName, rawToken);

  const createdUser = await User.findById(user._id).select('-password -refreshToken');

  return res.status(201).json(
    new ApiResponse(201, { userId: createdUser._id, email: createdUser.email }, 'Account created. Please check your email to verify your account.')
  );
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;

  if (!token) {
    throw new ApiError(400, 'Token is required');
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, 'Invalid or expired verification link');
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpiry = undefined;
  await user.save();

  await sendWelcomeEmail(user.email, user.firstName);

  return res.status(200).json(new ApiResponse(200, null, 'Email verified successfully. You can now log in.'));
});

export const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.isEmailVerified) {
    throw new ApiError(400, 'Account is already verified');
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

  user.emailVerificationToken = hashedToken;
  user.emailVerificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000;
  await user.save();

  await sendVerificationEmail(email, user.firstName, rawToken);

  return res.status(200).json(new ApiResponse(200, null, 'Verification email resent. Please check your inbox.'));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  if (!user.isEmailVerified) {
    throw new ApiError(403, 'Email not verified. Please verify your email first.');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const accessToken = generateAccessToken(user._id, user.email);
  const refreshToken = generateRefreshToken(user._id);

  const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
  user.refreshToken = hashedRefreshToken;
  await user.save();

  res.cookie('refreshToken', refreshToken, cookieOptions);

  const loggedInUser = await User.findById(user._id).select('-password -refreshToken -emailVerificationToken -passwordResetToken');

  return res.status(200).json(
    new ApiResponse(
      200,
      { accessToken, user: loggedInUser },
      'Login successful.'
    )
  );
});

export const refresh = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, 'Refresh token is missing');
  }

  const hashedToken = crypto.createHash('sha256').update(incomingRefreshToken).digest('hex');
  const user = await User.findOne({ refreshToken: hashedToken });

  if (!user) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  const accessToken = generateAccessToken(user._id, user.email);
  const newRefreshToken = generateRefreshToken(user._id);

  const newHashedRefreshToken = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
  user.refreshToken = newHashedRefreshToken;
  await user.save();

  res.cookie('refreshToken', newRefreshToken, cookieOptions);

  return res.status(200).json(new ApiResponse(200, { accessToken }, 'Token refreshed.'));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.passwordResetToken = hashedToken;
    user.passwordResetTokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    await sendPasswordResetEmail(email, rawToken);
  }

  return res.status(200).json(new ApiResponse(200, null, 'If this email is registered, a reset link has been sent.'));
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, 'Invalid or expired reset link');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  user.password = hashedPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpiry = undefined;
  user.refreshToken = undefined; // Force logout everywhere
  await user.save();

  return res.status(200).json(new ApiResponse(200, null, 'Password reset successful. Please log in with your new password.'));
});

export const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  res.clearCookie('refreshToken', cookieOptions);

  return res.status(200).json(new ApiResponse(200, null, 'Logged out successfully.'));
});

export const me = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user, 'User profile fetched.'));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, avatar, preferences } = req.body;

  const updateFields = {};
  if (firstName) updateFields.firstName = firstName;
  if (lastName) updateFields.lastName = lastName;
  if (avatar) updateFields.avatar = avatar;
  if (preferences) {
    updateFields.preferences = { ...req.user.preferences, ...preferences };
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updateFields },
    { new: true }
  ).select('-password -refreshToken -emailVerificationToken -passwordResetToken');

  return res.status(200).json(new ApiResponse(200, updatedUser, 'Profile updated successfully.'));
});
