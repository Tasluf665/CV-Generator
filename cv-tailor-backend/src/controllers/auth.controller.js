const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const User = require('../models/User.model');

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  
  if (!email || !password || !fullName) {
    throw new ApiError(400, 'All fields are required');
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, 'User with email already exists');
  }

  const user = await User.create({ fullName, email, password });
  const createdUser = await User.findById(user._id).select('-password');

  if (!createdUser) {
    throw new ApiError(500, 'Something went wrong while registering the user');
  }

  return res.status(201).json(
    new ApiResponse(201, createdUser, 'User registered successfully')
  );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, 'User does not exist');
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid user credentials');
  }

  const accessToken = user.generateAccessToken();
  const loggedInUser = await User.findById(user._id).select('-password');

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  return res
    .status(200)
    .cookie('token', accessToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, token: accessToken },
        'User logged in successfully'
      )
    );
});

module.exports = {
  registerUser,
  loginUser,
};
