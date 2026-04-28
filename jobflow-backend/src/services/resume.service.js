import Resume from '../models/Resume.model.js';
import Job from '../models/Job.model.js';
import { ApiError } from '../utils/ApiError.js';
import * as resumeAnalyzer from './ai/resumeAnalyzer.service.js';
import * as jobMatcher from './ai/jobMatcher.service.js';
import * as jobService from './job.service.js';

export const getAllResumes = async (userId) => {
  return await Resume.find({ userId }).sort({ updatedAt: -1 });
};

export const createResume = async (userId, resumeData) => {
  const resume = await Resume.create({
    ...resumeData,
    userId,
  });
  return resume;
};

export const getResumeById = async (userId, resumeId) => {
  const resume = await Resume.findOne({ _id: resumeId, userId });
  if (!resume) {
    throw new ApiError(404, 'Resume not found.');
  }
  return resume;
};

export const updateResume = async (userId, resumeId, updateData) => {
  const resume = await Resume.findOneAndUpdate(
    { _id: resumeId, userId },
    { $set: updateData },
    { new: true, runValidators: true }
  );
  if (!resume) {
    throw new ApiError(404, 'Resume not found.');
  }
  return resume;
};

export const deleteResume = async (userId, resumeId) => {
  const resume = await Resume.findOneAndDelete({ _id: resumeId, userId });
  if (!resume) {
    throw new ApiError(404, 'Resume not found.');
  }
  return resume;
};

export const updateDesign = async (userId, resumeId, designData) => {
  const resume = await Resume.findOneAndUpdate(
    { _id: resumeId, userId },
    { $set: { design: designData } },
    { new: true, runValidators: true }
  );
  if (!resume) {
    throw new ApiError(404, 'Resume not found.');
  }
  return resume;
};

export const updateSections = async (userId, resumeId, sectionsData) => {
  const resume = await Resume.findOneAndUpdate(
    { _id: resumeId, userId },
    { $set: sectionsData },
    { new: true, runValidators: true }
  );
  if (!resume) {
    throw new ApiError(404, 'Resume not found.');
  }
  return resume;
};

export const analyzeResume = async (userId, resumeId) => {
  const resume = await getResumeById(userId, resumeId);
  
  const analysisResult = await resumeAnalyzer.analyzeResume(resume);
  
  const updatedResume = await Resume.findOneAndUpdate(
    { _id: resumeId, userId },
    { 
      $set: { 
        analysis: {
          ...analysisResult,
          analyzedAt: new Date()
        } 
      } 
    },
    { new: true }
  );
  
  return updatedResume.analysis;
};

export const generateKeywords = async (userId, resumeId) => {
  const resume = await getResumeById(userId, resumeId);
  
  const extractedKeywords = await resumeAnalyzer.generateResumeKeywords(resume);
  
  const updatedResume = await Resume.findOneAndUpdate(
    { _id: resumeId, userId },
    { $set: { extractedKeywords } },
    { new: true }
  );
  
  return updatedResume.extractedKeywords;
};

export const matchResume = async (userId, resumeId, jobId) => {
  const resume = await getResumeById(userId, resumeId);
  let job = await Job.findOne({ _id: jobId, userId });
  
  if (!job) {
    throw new ApiError(404, 'Job not found.');
  }

  const hasJobKeywords = Object.values(job.parsedData?.extractedKeywords || {}).some(arr => arr && arr.length > 0);
  if (!hasJobKeywords) {
    job = await jobService.generateKeywordsForJob(userId, jobId);
  }

  const hasResumeKeywords = Object.values(resume.extractedKeywords || {}).some(arr => arr && arr.length > 0);
  if (!hasResumeKeywords) {
    resume.extractedKeywords = await generateKeywords(userId, resumeId);
  }
  
  const matchResult = await jobMatcher.matchResumeWithJob(resume.extractedKeywords, job.parsedData.extractedKeywords);
  
  const matchEntry = {
    jobId,
    ...matchResult,
    analyzedAt: new Date()
  };
  
  const updatedResume = await Resume.findOneAndUpdate(
    { _id: resumeId, userId },
    { 
      $push: { 
        matchResults: matchEntry
      } 
    },
    { new: true }
  );
  
  return matchEntry;
};

