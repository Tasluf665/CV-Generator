import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import CoverLetter from '../models/CoverLetter.model.js';
import Resume from '../models/Resume.model.js';
import Job from '../models/Job.model.js';
import * as coverLetterAiService from '../services/ai/coverLetter.service.js';

export const getAllCoverLetters = asyncHandler(async (req, res) => {
  const coverLetters = await CoverLetter.find({ userId: req.user._id })
    .populate('resumeId', 'title')
    .populate('jobId', 'companyName role')
    .sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(200, { coverLetters }, 'Cover letters fetched successfully.')
  );
});

export const generateCoverLetter = asyncHandler(async (req, res) => {
  const { resumeId, jobId, jobDescription, tone, length } = req.body;

  // 1. Fetch Resume Data
  const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
  if (!resume) {
    throw new ApiError(404, 'Resume not found');
  }

  // 2. Get Job Description
  let finalJobDescription = jobDescription;
  if (jobId) {
    const job = await Job.findOne({ _id: jobId, userId: req.user._id });
    if (job) {
      finalJobDescription = job.description || jobDescription;
    }
  }

  if (!finalJobDescription) {
    throw new ApiError(400, 'Job description is required to generate a cover letter');
  }

  // 3. Generate Content via AI
  const content = await coverLetterAiService.generateCoverLetter({
    resumeData: resume,
    jobDescription: finalJobDescription,
    tone,
    length,
  });

  // 4. Save to Database
  const coverLetter = await CoverLetter.create({
    userId: req.user._id,
    resumeId,
    jobId: jobId || null,
    title: `Cover Letter - ${resume.title} - ${new Date().toLocaleDateString()}`,
    content,
    tone,
    length,
    isAiGenerated: true,
  });

  res.status(201).json(
    new ApiResponse(201, { coverLetter }, 'Cover letter generated successfully.')
  );
});

export const getCoverLetterById = asyncHandler(async (req, res) => {
  const coverLetter = await CoverLetter.findOne({
    _id: req.params.id,
    userId: req.user._id,
  })
    .populate('resumeId', 'title')
    .populate('jobId', 'companyName role');

  if (!coverLetter) {
    throw new ApiError(404, 'Cover letter not found');
  }

  res.status(200).json(
    new ApiResponse(200, { coverLetter }, 'Cover letter fetched successfully.')
  );
});

export const updateCoverLetter = asyncHandler(async (req, res) => {
  const coverLetter = await CoverLetter.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!coverLetter) {
    throw new ApiError(404, 'Cover letter not found');
  }

  res.status(200).json(
    new ApiResponse(200, { coverLetter }, 'Cover letter updated successfully.')
  );
});

export const deleteCoverLetter = asyncHandler(async (req, res) => {
  const coverLetter = await CoverLetter.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!coverLetter) {
    throw new ApiError(404, 'Cover letter not found');
  }

  res.status(200).json(
    new ApiResponse(200, null, 'Cover letter deleted successfully.')
  );
});
