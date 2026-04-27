import Joi from 'joi';

const contactSchema = Joi.object({
  firstName: Joi.string().allow('').optional(),
  lastName: Joi.string().allow('').optional(),
  pronouns: Joi.string().allow('').optional(),
  email: Joi.string().email().allow('').optional(),
  phone: Joi.string().allow('').optional(),
  linkedin: Joi.string().allow('').optional(),
  twitter: Joi.string().allow('').optional(),
  address: Joi.string().allow('').optional(),
  city: Joi.string().allow('').optional(),
  state: Joi.string().allow('').optional(),
  website: Joi.string().allow('').optional(),
  visibleFields: Joi.array().items(Joi.string()).optional(),
});

const workExperienceSchema = Joi.object({
  company: Joi.string().allow('').optional(),
  role: Joi.string().allow('').optional(),

  location: Joi.string().allow('').optional(),
  startDate: Joi.string().allow('').optional(),
  endDate: Joi.string().allow('').optional(),
  isCurrent: Joi.boolean().optional(),
  bullets: Joi.array().items(Joi.string()).optional(),
  order: Joi.number().optional(),
});

const educationSchema = Joi.object({
  institution: Joi.string().allow('').optional(),

  degree: Joi.string().allow('').optional(),
  field: Joi.string().allow('').optional(),
  location: Joi.string().allow('').optional(),
  startDate: Joi.string().allow('').optional(),
  endDate: Joi.string().allow('').optional(),
  gpa: Joi.string().allow('').optional(),
  bullets: Joi.array().items(Joi.string()).optional(),
  order: Joi.number().optional(),
});

const skillSchema = Joi.object({
  category: Joi.string().allow('').optional(),
  items: Joi.array().items(Joi.string()).optional(),
});

const projectSchema = Joi.object({
  name: Joi.string().allow('').optional(),

  description: Joi.string().allow('').optional(),
  techStack: Joi.array().items(Joi.string()).optional(),
  url: Joi.string().uri().allow('').optional(),
  startDate: Joi.string().allow('').optional(),
  endDate: Joi.string().allow('').optional(),
  bullets: Joi.array().items(Joi.string()).optional(),
  order: Joi.number().optional(),
});

export const createResume = Joi.object({
  title: Joi.string().required().trim(),
  targetJobTitle: Joi.string().allow('').optional().trim(),
  linkedJobId: Joi.string().hex().length(24).optional(),
  contact: contactSchema.optional(),
  summary: Joi.string().allow('').optional(),
  workExperience: Joi.array().items(workExperienceSchema).optional(),
  education: Joi.array().items(educationSchema).optional(),
  skills: Joi.array().items(skillSchema).optional(),
  projects: Joi.array().items(projectSchema).optional(),
});

export const updateResume = Joi.object({
  title: Joi.string().trim().optional(),
  targetJobTitle: Joi.string().allow('').trim().optional(),
  linkedJobId: Joi.string().hex().length(24).allow(null).optional(),
  contact: contactSchema.optional(),
  summary: Joi.string().allow('').optional(),
  workExperience: Joi.array().items(workExperienceSchema).optional(),
  education: Joi.array().items(educationSchema).optional(),
  skills: Joi.array().items(skillSchema).optional(),
  projects: Joi.array().items(projectSchema).optional(),
  design: Joi.object().optional(),
});

export const matchResume = Joi.object({
  jobId: Joi.string().hex().length(24).required(),
});

export const updateDesign = Joi.object({
  template: Joi.string().optional(),
  font: Joi.string().optional(),
  accentColor: Joi.string().pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
  lineHeight: Joi.number().optional(),
  listLineHeight: Joi.number().optional(),
  fontSize: Joi.number().optional(),
  margin: Joi.number().optional(),
  dateFormat: Joi.string().allow('').optional(),
});

export const updateSections = Joi.object({
  sectionOrder: Joi.array().items(Joi.string()).optional(),
  hiddenSections: Joi.array().items(Joi.string()).optional(),
});

