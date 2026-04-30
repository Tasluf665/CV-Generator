import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as resumeService from '../services/resume.service.js';

export const getAllResumes = asyncHandler(async (req, res) => {
  const resumes = await resumeService.getAllResumes(req.user._id);
  res.status(200).json(new ApiResponse(200, { resumes }, 'Resumes fetched successfully.'));
});

export const createResume = asyncHandler(async (req, res) => {
  const resume = await resumeService.createResume(req.user._id, req.body);
  res.status(201).json(new ApiResponse(201, { resume }, 'Resume created successfully.'));
});

export const getResumeById = asyncHandler(async (req, res) => {
  const resume = await resumeService.getResumeById(req.user._id, req.params.id);
  res.status(200).json(new ApiResponse(200, { resume }, 'Resume fetched successfully.'));
});

export const updateResume = asyncHandler(async (req, res) => {
  const resume = await resumeService.updateResume(req.user._id, req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, { resume }, 'Resume updated successfully.'));
});

export const deleteResume = asyncHandler(async (req, res) => {
  await resumeService.deleteResume(req.user._id, req.params.id);
  res.status(200).json(new ApiResponse(200, null, 'Resume deleted successfully.'));
});

export const duplicateResume = asyncHandler(async (req, res) => {
  const resume = await resumeService.duplicateResume(req.user._id, req.params.id);
  res.status(201).json(new ApiResponse(201, { resume }, 'Resume duplicated successfully.'));
});

export const analyzeResume = asyncHandler(async (req, res) => {
  const analysis = await resumeService.analyzeResume(req.user._id, req.params.id);
  res.status(200).json(new ApiResponse(200, { analysis }, 'Resume analysis complete.'));
});

export const matchResume = asyncHandler(async (req, res) => {
  const matchResults = await resumeService.matchResume(req.user._id, req.params.id, req.body.jobId);
  res.status(200).json(new ApiResponse(200, { matchResults }, 'Job match analysis complete.'));
});

export const generateResumeKeywords = asyncHandler(async (req, res) => {
  const extractedKeywords = await resumeService.generateKeywords(req.user._id, req.params.id);
  res.status(200).json(new ApiResponse(200, { extractedKeywords }, 'Resume keywords generated successfully.'));
});

export const updateDesign = asyncHandler(async (req, res) => {
  const resume = await resumeService.updateDesign(req.user._id, req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, { resume }, 'Resume design updated.'));
});

export const updateSections = asyncHandler(async (req, res) => {
  const resume = await resumeService.updateSections(req.user._id, req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, { resume }, 'Resume sections updated.'));
});

export const generateBullet = asyncHandler(async (req, res) => {
  const bulletText = await resumeService.generateBullet(req.user._id, req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, { bulletText }, 'Bullet generated successfully.'));
});

export const updateKeywordStatus = asyncHandler(async (req, res) => {
  const result = await resumeService.updateKeywordStatus(req.user._id, req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, result, 'Keyword status updated successfully.'));
});
