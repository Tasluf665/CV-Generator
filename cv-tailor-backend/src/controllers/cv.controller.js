const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const CV = require('../models/CV.model');

const createCV = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const cv = await CV.create({ title, owner: req.user._id });
  return res.status(201).json(new ApiResponse(201, cv, 'CV created successfully'));
});

const getCVs = asyncHandler(async (req, res) => {
  const cvs = await CV.find({ owner: req.user._id });
  return res.status(200).json(new ApiResponse(200, cvs, 'CVs fetched successfully'));
});

module.exports = {
  createCV,
  getCVs,
};
