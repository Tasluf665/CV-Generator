const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const mongoose = require('mongoose');

const verifyJWT = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new ApiError(401, 'Unauthorized request');
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    
    // In a real app, you would fetch the user from DB
    // const user = await User.findById(decodedToken._id).select('-password');
    // if (!user) throw new ApiError(401, 'Invalid Access Token');
    
    req.user = decodedToken;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid access token');
  }
});

module.exports = { verifyJWT };
