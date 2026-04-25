import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as jobService from '../services/job.service.js';

/**
 * Get all jobs for the current user
 */
export const getAllJobs = asyncHandler(async (req, res) => {
  const result = await jobService.getAllJobs(req.user._id, req.query);
  res.status(200).json(new ApiResponse(200, result, 'Jobs fetched successfully.'));
});

/**
 * Create a new job manually
 */
export const createJob = asyncHandler(async (req, res) => {
  const job = await jobService.createJob(req.user._id, req.body);
  res.status(201).json(new ApiResponse(201, job, 'Job saved successfully.'));
});

/**
 * Scrape job data from URL (LinkedIn for now)
 */
export const scrapeJobFromUrl = asyncHandler(async (req, res) => {
  const { jobUrl } = req.body;
  const scraped = await jobService.scrapeJobFromUrl(jobUrl);
  res.status(200).json(new ApiResponse(200, scraped, 'Job data scraped successfully.'));
});

/**
 * Parse a job description and create a job entry
 */
export const parseJobDescription = asyncHandler(async (req, res) => {
  const job = await jobService.parseAndSaveJob(req.user._id, req.body);

  res.status(201).json(new ApiResponse(201, job, 'Job description parsed and saved successfully.'));
});

/**
 * Get a specific job by ID
 */
export const getJobById = asyncHandler(async (req, res) => {
  const job = await jobService.getJobById(req.user._id, req.params.id);
  res.status(200).json(new ApiResponse(200, job, 'Job fetched successfully.'));
});

/**
 * Update a job entry
 */
export const updateJob = asyncHandler(async (req, res) => {
  const job = await jobService.updateJob(req.user._id, req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, job, 'Job updated successfully.'));
});

/**
 * Update a checklist item's status
 */
export const updateChecklistItem = asyncHandler(async (req, res) => {
  const { checklistId, isCompleted } = req.body;
  const job = await jobService.updateChecklistItem(req.user._id, req.params.id, checklistId, isCompleted);
  res.status(200).json(new ApiResponse(200, job, 'Checklist updated.'));
});

/**
 * Add a contact person to a job
 */
export const addContact = asyncHandler(async (req, res) => {
  const job = await jobService.addContact(req.user._id, req.params.id, req.body);
  res.status(201).json(new ApiResponse(201, job, 'Contact added successfully.'));
});

/**
 * Remove a contact from a job
 */
export const deleteContact = asyncHandler(async (req, res) => {
  const job = await jobService.deleteContact(req.user._id, req.params.id, req.params.contactId);
  res.status(200).json(new ApiResponse(200, job, 'Contact removed successfully.'));
});

/**
 * Add an email template to a job
 */
export const addEmailTemplate = asyncHandler(async (req, res) => {
  const job = await jobService.addEmailTemplate(req.user._id, req.params.id, req.body);
  res.status(201).json(new ApiResponse(201, job, 'Email template added successfully.'));
});

/**
 * Delete a job entry
 */
export const deleteJob = asyncHandler(async (req, res) => {
  await jobService.deleteJob(req.user._id, req.params.id);
  res.status(200).json(new ApiResponse(200, null, 'Job deleted successfully.'));
});

/**
 * Reparse a job description for an existing job
 */
export const reparseJobDescription = asyncHandler(async (req, res) => {
  const job = await jobService.reparseJob(req.user._id, req.params.id);
  res.status(200).json(new ApiResponse(200, job, 'Job description reparsed successfully.'));
});
