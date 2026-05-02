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
  isVisible: Joi.boolean().optional(),
  company: Joi.string().allow('').optional(),
  isCompanyVisible: Joi.boolean().optional(),
  companyDescription: Joi.string().allow('').optional(),
  role: Joi.string().allow('').optional(),
  isRoleVisible: Joi.boolean().optional(),
  positionDescription: Joi.string().allow('').optional(),
  positionType: Joi.string().allow('').optional(),
  location: Joi.string().allow('').optional(),
  isLocationVisible: Joi.boolean().optional(),
  startDate: Joi.string().allow('').optional(),
  endDate: Joi.string().allow('').optional(),
  isDateVisible: Joi.boolean().optional(),
  isCurrent: Joi.boolean().optional(),
  bullets: Joi.array().items(Joi.object({
    text: Joi.string().allow('').optional(),
    isVisible: Joi.boolean().optional(),
  })).optional(),
  order: Joi.number().optional(),
});

const educationSchema = Joi.object({
  isVisible: Joi.boolean().optional(),
  institution: Joi.string().allow('').optional(),
  isInstitutionVisible: Joi.boolean().optional(),
  degree: Joi.string().allow('').optional(),
  isDegreeVisible: Joi.boolean().optional(),
  field: Joi.string().allow('').optional(),
  isFieldVisible: Joi.boolean().optional(),
  location: Joi.string().allow('').optional(),
  isLocationVisible: Joi.boolean().optional(),
  startDate: Joi.string().allow('').optional(),
  endDate: Joi.string().allow('').optional(),
  isDateVisible: Joi.boolean().optional(),
  gpa: Joi.string().allow('').optional(),
  isGpaVisible: Joi.boolean().optional(),
  bullets: Joi.array().items(Joi.object({
    text: Joi.string().allow('').optional(),
    isVisible: Joi.boolean().optional(),
  })).optional(),
  order: Joi.number().optional(),
});

const skillSchema = Joi.object({
  isVisible: Joi.boolean().optional(),
  category: Joi.string().allow('').optional(),
  items: Joi.array().items(
    Joi.alternatives().try(
      Joi.string(),
      Joi.object({
        text: Joi.string().allow('').optional(),
        isVisible: Joi.boolean().optional(),
      })
    )
  ).optional(),
});

const projectSchema = Joi.object({
  isVisible: Joi.boolean().optional(),
  name: Joi.string().allow('').optional(),
  isNameVisible: Joi.boolean().optional(),
  description: Joi.string().allow('').optional(),
  techStack: Joi.array().items(Joi.string()).optional(),
  url: Joi.string().uri().allow('').optional(),
  isUrlVisible: Joi.boolean().optional(),
  startDate: Joi.string().allow('').optional(),
  endDate: Joi.string().allow('').optional(),
  isDateVisible: Joi.boolean().optional(),
  bullets: Joi.array().items(Joi.object({
    text: Joi.string().allow('').optional(),
    isVisible: Joi.boolean().optional(),
  })).optional(),
  order: Joi.number().optional(),
});

const customSectionSchema = Joi.object({
  id: Joi.string().optional(),
  title: Joi.string().required(),
  isVisible: Joi.boolean().optional(),
  items: Joi.array().items(Joi.object({
    id: Joi.string().optional(),
    title: Joi.string().allow('').optional(),
    date: Joi.string().allow('').optional(),
    isDateVisible: Joi.boolean().optional(),
    subtitle: Joi.string().allow('').optional(),
    isSubtitleVisible: Joi.boolean().optional(),
    bullets: Joi.array().items(Joi.object({
      text: Joi.string().allow('').optional(),
      isVisible: Joi.boolean().optional(),
    })).optional(),
    isVisible: Joi.boolean().optional(),
    order: Joi.number().optional(),
  })).optional(),
  order: Joi.number().optional(),
});

export const createResume = Joi.object({
  title: Joi.string().required().trim(),
  targetJobTitle: Joi.string().allow('').optional().trim(),
  targetTitles: Joi.array().items(Joi.string()).optional(),
  linkedJobId: Joi.string().hex().length(24).optional(),
  contact: contactSchema.optional(),
  summary: Joi.string().allow('').optional(),
  summaries: Joi.array().items(Joi.string()).optional(),
  coverLetterPrompts: Joi.array().items(Joi.string()).optional(),
  workExperience: Joi.array().items(workExperienceSchema).optional(),
  education: Joi.array().items(educationSchema).optional(),
  skills: Joi.array().items(skillSchema).optional(),
  projects: Joi.array().items(projectSchema).optional(),
  customSections: Joi.array().items(customSectionSchema).optional(),
});

export const updateResume = Joi.object({
  title: Joi.string().trim().optional(),
  targetJobTitle: Joi.string().allow('').trim().optional(),
  targetTitles: Joi.array().items(Joi.string()).optional(),
  linkedJobId: Joi.string().hex().length(24).allow(null).optional(),
  contact: contactSchema.optional(),
  summary: Joi.string().allow('').optional(),
  summaries: Joi.array().items(Joi.string()).optional(),
  coverLetterPrompts: Joi.array().items(Joi.string()).optional(),
  workExperience: Joi.array().items(workExperienceSchema).optional(),
  education: Joi.array().items(educationSchema).optional(),
  skills: Joi.array().items(skillSchema).optional(),
  projects: Joi.array().items(projectSchema).optional(),
  customSections: Joi.array().items(customSectionSchema).optional(),
  sectionOrder: Joi.array().items(Joi.string()).optional(),
  design: Joi.object().optional(),
});

export const matchResume = Joi.object({
  jobId: Joi.string().hex().length(24).required(),
});

const sectionStyleSchema = Joi.object({
  fontSize: Joi.number().optional(),
  fontFamily: Joi.string().optional(),
  color: Joi.string().pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
  margin: Joi.number().optional(),
  lineHeight: Joi.number().optional(),
  letterSpacing: Joi.number().optional(),
  alignment: Joi.string().valid('left', 'center', 'right').optional(),
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
  sectionStyles: Joi.object({
    title: sectionStyleSchema.optional(),
    summary: sectionStyleSchema.optional(),
    experience: sectionStyleSchema.optional(),
    education: sectionStyleSchema.optional(),
    projects: sectionStyleSchema.optional(),
    skills: sectionStyleSchema.optional(),
    contact: sectionStyleSchema.optional(),
  }).optional(),
});

export const updateSections = Joi.object({
  sectionOrder: Joi.array().items(Joi.string()).optional(),
  hiddenSections: Joi.array().items(Joi.string()).optional(),
});

export const generateBullet = Joi.object({
  keyword: Joi.string().required(),
  positionId: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
  sectionType: Joi.string().valid('workExperience', 'education', 'projects').required(),
  positionData: Joi.object().optional(),
});
