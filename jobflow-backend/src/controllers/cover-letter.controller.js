import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getAllCoverLetters = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, { coverLetters: [] }, 'Cover letters fetched successfully.'));
});

export const generateCoverLetter = asyncHandler(async (req, res) => {
  res.status(201).json(new ApiResponse(201, {}, 'Cover letter generated successfully.'));
});

export const getCoverLetterById = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, {}, 'Cover letter fetched successfully.'));
});

export const updateCoverLetter = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, {}, 'Cover letter updated successfully.'));
});

export const deleteCoverLetter = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, null, 'Cover letter deleted successfully.'));
});
