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

export const duplicateResume = async (userId, resumeId) => {
  const resumeToDuplicate = await getResumeById(userId, resumeId);
  const resumeData = resumeToDuplicate.toObject();
  
  delete resumeData._id;
  delete resumeData.__v;
  delete resumeData.createdAt;
  delete resumeData.updatedAt;
  
  resumeData.title = `${resumeData.title} (Copy)`;
  
  const duplicatedResume = await Resume.create(resumeData);
  return duplicatedResume;
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
  
  // Carry over any existing hidden keywords from a prior match result
  const existingMatch = resume.matchResults?.find(r => String(r.jobId) === String(jobId));
  const hiddenKeywordsList = existingMatch?.hiddenKeywords || [];

  const matchResult = await jobMatcher.matchResumeWithJob(
    resume.extractedKeywords,
    job.parsedData.extractedKeywords,
    hiddenKeywordsList
  );
  
  const matchEntry = {
    jobId,
    ...matchResult,
    analyzedAt: new Date()
  };
  
  // Replace any previous result for this job
  await Resume.findOneAndUpdate(
    { _id: resumeId, userId },
    { $pull: { matchResults: { jobId } } }
  );

  const updatedResume = await Resume.findOneAndUpdate(
    { _id: resumeId, userId },
    { 
      $push: { matchResults: matchEntry } 
    },
    { new: true }
  );
  
  return matchEntry;
};

export const generateBullet = async (userId, resumeId, { keyword, positionId, sectionType, positionData }) => {
  const resume = await getResumeById(userId, resumeId);
  
  // positionData can be passed from the frontend to give the AI context about the job.
  const bulletText = await resumeAnalyzer.generateBulletPoint(keyword, sectionType, positionData);
  return bulletText;
};

export const updateKeywordStatus = async (userId, resumeId, { jobId, keyword, status }) => {
  const resume = await getResumeById(userId, resumeId);
  const job = await Job.findOne({ _id: jobId, userId });

  if (!job) {
    throw new ApiError(404, 'Job not found.');
  }

  const lowerKeyword = keyword.toLowerCase();

  // 1. Update Resume Keywords
  if (!resume.extractedKeywords) {
    resume.extractedKeywords = { 'Hard Skills': [], 'Soft Skills': [], 'Others': [] };
  }

  if (status === 'matched' || status === 'hidden') {
    // Ensure keyword exists in extractedKeywords (required for both matched & hidden)
    const alreadyInResume = Object.values(resume.extractedKeywords).flat().some(k => k && k.toLowerCase() === lowerKeyword);
    if (!alreadyInResume) {
      if (!Array.isArray(resume.extractedKeywords['Hard Skills'])) resume.extractedKeywords['Hard Skills'] = [];
      resume.extractedKeywords['Hard Skills'].push(keyword);
    }
  } else {
    // status === 'missing': Remove from resume extractedKeywords entirely
    Object.keys(resume.extractedKeywords).forEach(cat => {
      if (Array.isArray(resume.extractedKeywords[cat])) {
        resume.extractedKeywords[cat] = resume.extractedKeywords[cat].filter(k => k.toLowerCase() !== lowerKeyword);
      }
    });
  }

  // 2. Update Job Keywords (ensure it exists in job for future matching)
  if (!job.parsedData) job.parsedData = {};
  if (!job.parsedData.extractedKeywords) {
    job.parsedData.extractedKeywords = { 'Hard Skills': [], 'Soft Skills': [], 'Others': [] };
  }
  const alreadyInJob = Object.values(job.parsedData.extractedKeywords).flat().some(k => k && k.toLowerCase() === lowerKeyword);
  if (!alreadyInJob) {
    if (!Array.isArray(job.parsedData.extractedKeywords['Hard Skills'])) job.parsedData.extractedKeywords['Hard Skills'] = [];
    job.parsedData.extractedKeywords['Hard Skills'].push(keyword);
  }

  // 3. Build the updated hidden list for this job
  const existingMatch = resume.matchResults?.find(r => String(r.jobId) === String(jobId));
  let currentHidden = (existingMatch?.hiddenKeywords || []).map(k => k.toLowerCase());

  if (status === 'hidden') {
    if (!currentHidden.includes(lowerKeyword)) currentHidden.push(lowerKeyword);
  } else {
    // Any other status removes from hidden
    currentHidden = currentHidden.filter(k => k !== lowerKeyword);
  }

  // Restore original casing where possible, otherwise keep lowercase
  const hiddenKeywordsList = currentHidden.map(k => {
    const orig = Object.values(resume.extractedKeywords).flat().find(kw => kw && kw.toLowerCase() === k);
    return orig || k;
  });

  // 4. Recalculate match
  const matchResult = await jobMatcher.matchResumeWithJob(
    resume.extractedKeywords,
    job.parsedData.extractedKeywords,
    hiddenKeywordsList
  );
  
  const matchEntry = {
    jobId,
    ...matchResult,
    hiddenKeywords: hiddenKeywordsList,
    analyzedAt: new Date()
  };

  // 5. Update Resume in DB (replace match result + update keywords)
  await Resume.findOneAndUpdate(
    { _id: resumeId, userId },
    { $pull: { matchResults: { jobId: jobId } } }
  );

  const updatedResume = await Resume.findOneAndUpdate(
    { _id: resumeId, userId },
    { 
      $set: { extractedKeywords: resume.extractedKeywords },
      $push: { matchResults: matchEntry }
    },
    { new: true }
  );

  // 6. Update Job in DB
  await Job.findOneAndUpdate(
    { _id: jobId, userId },
    { $set: { 'parsedData.extractedKeywords': job.parsedData.extractedKeywords } }
  );

  return {
    matchResults: matchEntry,
    extractedKeywords: updatedResume.extractedKeywords
  };
};
