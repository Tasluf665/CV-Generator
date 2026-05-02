import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import CoverLetter from '../models/CoverLetter.model.js';
import Resume from '../models/Resume.model.js';
import Job from '../models/Job.model.js';
import * as coverLetterAiService from '../services/ai/coverLetter.service.js';

export const getAllCoverLetters = asyncHandler(async (req, res) => {
  const { resumeId } = req.query;
  const filter = { userId: req.user._id };
  if (resumeId) filter.resumeId = resumeId;

  const coverLetters = await CoverLetter.find(filter)
    .populate('resumeId', 'title')
    .populate('jobId', 'company jobTitle')
    .sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(200, { coverLetters }, 'Cover letters fetched successfully.')
  );
});

export const generateCoverLetter = asyncHandler(async (req, res) => {
  const { resumeId, jobId, prompt, tone, length } = req.body;

  // 1. Fetch Resume
  const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
  if (!resume) {
    throw new ApiError(404, 'Resume not found');
  }

  // 2. Fetch Job from DB
  const job = await Job.findOne({ _id: jobId, userId: req.user._id });
  if (!job) {
    throw new ApiError(404, 'Job not found');
  }

  // 3. Build job context from all available fields
  const parsedSummary = job.parsedData?.summary;
  const parsedRequirements = job.parsedData?.requirements?.join('\n');
  const parsedResponsibilities = job.parsedData?.responsibilities?.join('\n');

  const jobContext = [
    job.jobTitle && `Role: ${job.jobTitle}`,
    job.company && `Company: ${job.company}`,
    job.location && `Location: ${job.location}`,
    job.jobType && `Job Type: ${job.jobType}`,
    parsedSummary && `Summary:\n${parsedSummary}`,
    parsedRequirements && `Requirements:\n${parsedRequirements}`,
    parsedResponsibilities && `Responsibilities:\n${parsedResponsibilities}`,
    !parsedSummary && job.rawJobDescription && `Job Description:\n${job.rawJobDescription}`,
  ]
    .filter(Boolean)
    .join('\n\n');

  // 4. Generate Content via AI
  const content = await coverLetterAiService.generateCoverLetter({
    resumeData: resume,
    jobDescription: jobContext,
    tone,
    length,
    userPrompt: prompt || null,
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
    .populate('jobId', 'company jobTitle');

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
