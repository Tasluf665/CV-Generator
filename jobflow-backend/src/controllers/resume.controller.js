import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getAllResumes = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, { resumes: [] }, 'Resumes fetched successfully.'));
});

export const createResume = asyncHandler(async (req, res) => {
  res.status(201).json(new ApiResponse(201, {}, 'Resume created successfully.'));
});

export const getResumeById = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, {}, 'Resume fetched successfully.'));
});

export const updateResume = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, {}, 'Resume updated successfully.'));
});

export const deleteResume = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, null, 'Resume deleted successfully.'));
});

export const analyzeResume = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, {}, 'Resume analysis complete.'));
});

export const matchResume = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, {}, 'Job match analysis complete.'));
});

export const updateDesign = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, {}, 'Resume design updated.'));
});

export const updateSections = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, {}, 'Resume sections updated.'));
});
