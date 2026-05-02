import Joi from 'joi';

export const generateCoverLetter = Joi.object({
  resumeId: Joi.string().required(),
  jobId: Joi.string().required(),
  prompt: Joi.string().max(2000),
  tone: Joi.string()
    .valid('Professional', 'Friendly', 'Enthusiastic', 'Formal')
    .default('Professional'),
  length: Joi.string().valid('Short', 'Standard', 'Detailed').default('Standard'),
});

export const updateCoverLetter = Joi.object({
  title: Joi.string().max(100),
  content: Joi.string(),
  tone: Joi.string().valid('Professional', 'Friendly', 'Enthusiastic', 'Formal'),
  length: Joi.string().valid('Short', 'Standard', 'Detailed'),
});
