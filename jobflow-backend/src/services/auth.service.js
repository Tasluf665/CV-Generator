import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User.model.js';
import { ApiError } from '../utils/ApiError.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail } from '../services/email.service.js';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Created user details
 */
export const registerUser = async ({ firstName, lastName, email, password }) => {
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

  return {
    userId: user._id,
    email: user.email,
  };
};

/**
 * Verify user email with token
 * @param {string} token - Verification token
 * @returns {Promise<void>}
 */
export const verifyUserEmail = async (token) => {
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
};

/**
 * Resend verification email
 * @param {string} email - User email
 * @returns {Promise<void>}
 */
export const resendUserVerification = async (email) => {
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
};

/**
 * Login user and generate tokens
 * @param {Object} credentials - Login credentials
 * @returns {Promise<Object>} Access token and user details
 */
export const loginUser = async ({ email, password }) => {
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

  const loggedInUser = await User.findById(user._id).select('-password -refreshToken -emailVerificationToken -passwordResetToken');

  return {
    accessToken,
    refreshToken,
    user: loggedInUser,
  };
};

/**
 * Refresh access token using refresh token
 * @param {string} incomingRefreshToken - Refresh token from cookies
 * @returns {Promise<Object>} New access and refresh tokens
 */
export const refreshUserToken = async (incomingRefreshToken) => {
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

  return {
    accessToken,
    newRefreshToken,
  };
};

/**
 * Process forgot password request
 * @param {string} email - User email
 * @returns {Promise<void>}
 */
export const processForgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (user) {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.passwordResetToken = hashedToken;
    user.passwordResetTokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    await sendPasswordResetEmail(email, rawToken);
  }
};

/**
 * Reset user password
 * @param {string} token - Reset token
 * @param {string} newPassword - New password
 * @returns {Promise<void>}
 */
export const resetUserPassword = async (token, newPassword) => {
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
};

/**
 * Logout user by clearing refresh token
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(
    userId,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );
};

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated user
 */
export const updateUserProfile = async (userId, updateData) => {
  const { firstName, lastName, avatar, preferences } = updateData;

  const updateFields = {};
  if (firstName) updateFields.firstName = firstName;
  if (lastName) updateFields.lastName = lastName;
  if (avatar) updateFields.avatar = avatar;
  if (preferences) {
    // Note: This assumes we have access to the current user's preferences.
    // In a real scenario, we might need to fetch the user first or use $set with dot notation.
    updateFields.preferences = preferences; 
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateFields },
    { new: true }
  ).select('-password -refreshToken -emailVerificationToken -passwordResetToken');

  if (!updatedUser) {
    throw new ApiError(404, 'User not found');
  }

  return updatedUser;
};
