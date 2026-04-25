import Joi from 'joi';

const salaryRangeSchema = Joi.object({
  min: Joi.number().optional(),
  max: Joi.number().optional(),
  currency: Joi.string().default('USD').optional(),
});

export const createJob = Joi.object({
  jobTitle: Joi.string().required().trim(),
  company: Joi.string().required().trim(),
  location: Joi.string().allow('').optional().trim(),
  jobType: Joi.string()
    .valid('Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance')
    .optional(),
  sourceUrl: Joi.string().uri().allow('').optional().trim(),
  rawJobDescription: Joi.string().allow('').optional(),
  status: Joi.string()
    .valid(
      'Bookmarked',
      'Applying',
      'Applied',
      'Interviewing',
      'Negotiating',
      'Accepted',
      'Rejected',
      'Closed'
    )
    .optional(),
  excitement: Joi.number().min(0).max(5).optional(),
  dateSaved: Joi.date().iso().allow(null).optional(),
  deadline: Joi.date().iso().allow(null).optional(),
  notes: Joi.string().allow('').optional(),
});

export const scrapeJob = Joi.object({
  jobUrl: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .custom((value, helpers) => {
      try {
        const { hostname, pathname } = new URL(value);
        const validHost = hostname === 'linkedin.com' || hostname === 'www.linkedin.com';
        const validPath = pathname.includes('/jobs/');

        if (!validHost || !validPath) {
          return helpers.error('any.invalid');
        }

        return value;
      } catch {
        return helpers.error('any.invalid');
      }
    }, 'LinkedIn URL validation')
    .messages({
      'any.invalid': 'jobUrl must be a valid LinkedIn job URL.',
    })
    .required(),
});

export const parseJob = Joi.object({
  jobTitle: Joi.string().required().trim(),
  company: Joi.string().required().trim(),
  location: Joi.string().allow('').optional().trim(),
  rawJobDescription: Joi.string().required().min(10),
  sourceUrl: Joi.string().uri().allow('').optional().trim(),
  jobType: Joi.string()
    .valid('Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance')
    .optional(),
  status: Joi.string()
    .valid(
      'Bookmarked',
      'Applying',
      'Applied',
      'Interviewing',
      'Negotiating',
      'Accepted',
      'Rejected',
      'Closed'
    )
    .optional(),
  excitement: Joi.number().min(0).max(5).optional(),
  deadline: Joi.date().iso().allow(null).optional(),
});

export const updateJob = Joi.object({
  jobTitle: Joi.string().trim().optional(),
  company: Joi.string().trim().optional(),
  location: Joi.string().allow('').trim().optional(),
  jobType: Joi.string()
    .valid('Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance')
    .optional(),
  sourceUrl: Joi.string().uri().allow('').trim().optional(),
  status: Joi.string()
    .valid(
      'Bookmarked',
      'Applying',
      'Applied',
      'Interviewing',
      'Negotiating',
      'Accepted',
      'Rejected',
      'Closed'
    )
    .optional(),
  excitement: Joi.number().min(0).max(5).optional(),
  dateSaved: Joi.date().iso().allow(null).optional(),
  deadline: Joi.date().iso().allow(null).optional(),
  dateApplied: Joi.date().iso().allow(null).optional(),
  followUpDate: Joi.date().iso().allow(null).optional(),
  notes: Joi.string().allow('').optional(),
  attachedResumeId: Joi.string().hex().length(24).optional(),
});

export const updateChecklist = Joi.object({
  checklistId: Joi.string().required(), // Using the _id of the checklist item
  isCompleted: Joi.boolean().required(),
});

export const addContact = Joi.object({
  name: Joi.string().required().trim(),
  role: Joi.string().allow('').optional().trim(),
  email: Joi.string().email().allow('').optional().trim(),
  linkedinUrl: Joi.string().uri().allow('').optional().trim(),
  notes: Joi.string().allow('').optional(),
});

export const addEmailTemplate = Joi.object({
  subject: Joi.string().required().trim(),
  body: Joi.string().required(),
  type: Joi.string().valid('Outreach', 'Follow-up', 'Thank-you', 'Other').required(),
});
