const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const Job = require('../models/Job.model');

const addJob = asyncHandler(async (req, res) => {
  const { jobTitle, company, description, url } = req.body;
  const job = await Job.create({
    jobTitle,
    company,
    description,
    url,
    owner: req.user._id,
  });
  return res.status(201).json(new ApiResponse(201, job, 'Job added successfully'));
});

const getJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ owner: req.user._id });
  return res.status(200).json(new ApiResponse(200, jobs, 'Jobs fetched successfully'));
});

module.exports = {
  addJob,
  getJobs,
};
