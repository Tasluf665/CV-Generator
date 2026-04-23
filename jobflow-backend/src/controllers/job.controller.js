import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getAllJobs = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, { jobs: [], pipelineCounts: {}, pagination: {} }, 'Jobs fetched successfully.'));
});

export const createJob = asyncHandler(async (req, res) => {
  res.status(201).json(new ApiResponse(201, {}, 'Job saved successfully.'));
});

export const parseJobDescription = asyncHandler(async (req, res) => {
  res.status(201).json(new ApiResponse(201, {}, 'Job description parsed and saved successfully.'));
});

export const getJobById = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, {}, 'Job fetched successfully.'));
});

export const updateJob = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, {}, 'Job updated successfully.'));
});

export const updateChecklistItem = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, {}, 'Checklist updated.'));
});

export const addContact = asyncHandler(async (req, res) => {
  res.status(201).json(new ApiResponse(201, {}, 'Contact added successfully.'));
});

export const deleteContact = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, {}, 'Contact removed successfully.'));
});

export const addEmailTemplate = asyncHandler(async (req, res) => {
  res.status(201).json(new ApiResponse(201, {}, 'Email template added successfully.'));
});

export const deleteJob = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, null, 'Job deleted successfully.'));
});

export const reparseJobDescription = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, {}, 'Job description reparsed successfully.'));
});
