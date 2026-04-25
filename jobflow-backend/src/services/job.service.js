import Job from '../models/Job.model.js';
import { ApiError } from '../utils/ApiError.js';
import * as jobParserService from './ai/jobParser.service.js';
import { scrapeLinkedInJobDetails } from './scrapers/linkedin/linkedinJobScraper.service.js';

/**
 * Fetch all jobs for a user with optional filters and pagination
 */
export const getAllJobs = async (userId, query = {}) => {
  const { status, search, page = 1, limit = 10 } = query;
  const filter = { userId };

  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { jobTitle: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
    ];
  }

  const jobs = await Job.find(filter)
    .sort({ dateSaved: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Job.countDocuments(filter);

  // Get counts for each status (pipeline)
  const pipelineCounts = await Job.aggregate([
    { $match: { userId: filter.userId } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const countsMap = pipelineCounts.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {});

  return {
    jobs,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    },
    pipelineCounts: countsMap,
  };
};

/**
 * Create a new job manually
 */
export const createJob = async (userId, jobData) => {
  return await Job.create({ ...jobData, userId });
};

/**
 * Scrape a job URL (currently LinkedIn only)
 */
export const scrapeJobFromUrl = async (jobUrl) => {
  const scraped = await scrapeLinkedInJobDetails(jobUrl);

  return {
    jobTitle: scraped.jobTitle,
    company: scraped.company,
    location: scraped.location,
    rawJobDescription: scraped.aboutTheJob,
    sourceUrl: jobUrl,
  };
};

/**
 * Parse a user-confirmed job description and save
 */
export const parseAndSaveJob = async (
  userId,
  { jobTitle, company, location, rawJobDescription, sourceUrl, jobType, status, excitement, deadline }
) => {
  const parsedData = await jobParserService.parseJobDescription(rawJobDescription);

  const job = await Job.create({
    userId,
    jobTitle,
    company,
    location,
    sourceUrl,
    jobType,
    status: status || 'Bookmarked',
    excitement,
    deadline,
    rawJobDescription,
    parsedData: {
      summary: parsedData.summary,
      requirements: parsedData.requirements,
      responsibilities: parsedData.responsibilities,
      extractedKeywords: parsedData.extractedKeywords,
    },
  });

  return job;
};

/**
 * Get job by ID
 */
export const getJobById = async (userId, jobId) => {
  const job = await Job.findOne({ _id: jobId, userId });
  if (!job) throw new ApiError(404, 'Job not found');
  return job;
};

/**
 * Update job details
 */
export const updateJob = async (userId, jobId, updateData) => {
  const job = await Job.findOneAndUpdate(
    { _id: jobId, userId },
    { $set: updateData },
    { new: true, runValidators: true }
  );
  if (!job) throw new ApiError(404, 'Job not found');
  return job;
};

/**
 * Toggle or update checklist item
 */
export const updateChecklistItem = async (userId, jobId, checklistId, isCompleted) => {
  const job = await Job.findOneAndUpdate(
    { _id: jobId, userId, 'checklist._id': checklistId },
    { $set: { 'checklist.$.isCompleted': isCompleted } },
    { new: true }
  );
  if (!job) throw new ApiError(404, 'Job or checklist item not found');
  return job;
};

/**
 * Add a contact to a job
 */
export const addContact = async (userId, jobId, contactData) => {
  const job = await Job.findOneAndUpdate(
    { _id: jobId, userId },
    { $push: { contacts: contactData } },
    { new: true }
  );
  if (!job) throw new ApiError(404, 'Job not found');
  return job;
};

/**
 * Remove a contact from a job
 */
export const deleteContact = async (userId, jobId, contactId) => {
  const job = await Job.findOneAndUpdate(
    { _id: jobId, userId },
    { $pull: { contacts: { _id: contactId } } },
    { new: true }
  );
  if (!job) throw new ApiError(404, 'Job not found');
  return job;
};

/**
 * Add an email template
 */
export const addEmailTemplate = async (userId, jobId, templateData) => {
  const job = await Job.findOneAndUpdate(
    { _id: jobId, userId },
    { $push: { emailTemplates: templateData } },
    { new: true }
  );
  if (!job) throw new ApiError(404, 'Job not found');
  return job;
};

/**
 * Delete a job
 */
export const deleteJob = async (userId, jobId) => {
  const job = await Job.findOneAndDelete({ _id: jobId, userId });
  if (!job) throw new ApiError(404, 'Job not found');
  return job;
};

/**
 * Reparse existing job description
 */
export const reparseJob = async (userId, jobId) => {
  const job = await Job.findOne({ _id: jobId, userId });
  if (!job) throw new ApiError(404, 'Job not found');
  if (!job.rawJobDescription) throw new ApiError(400, 'No job description found to reparse');

  const parsedData = await jobParserService.parseJobDescription(job.rawJobDescription);

  // Update existing job with newly parsed data but keep manually edited fields if they were changed?
  // For simplicity, we just update the parsedData field and any missing basic fields.
  job.parsedData = {
    summary: parsedData.summary,
    requirements: parsedData.requirements,
    responsibilities: parsedData.responsibilities,
    extractedKeywords: parsedData.extractedKeywords,
  };

  await job.save();
  return job;
};
