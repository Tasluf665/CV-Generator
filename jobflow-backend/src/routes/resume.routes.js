import express from 'express';
import * as resumeController from '../controllers/resume.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import * as resumeValidator from '../validators/resume.validator.js';

const router = express.Router();

// All resume routes are protected
router.use(verifyJWT);

router.get('/', resumeController.getAllResumes);
router.post('/', validate(resumeValidator.createResume), resumeController.createResume);

router.get('/:id', resumeController.getResumeById);
router.patch('/:id', validate(resumeValidator.updateResume), resumeController.updateResume);
router.delete('/:id', resumeController.deleteResume);
router.post('/:id/duplicate', resumeController.duplicateResume);

router.post('/:id/analyze', resumeController.analyzeResume);
router.post('/:id/match', validate(resumeValidator.matchResume), resumeController.matchResume);
router.post('/:id/keywords', resumeController.generateResumeKeywords);

router.patch('/:id/design', validate(resumeValidator.updateDesign), resumeController.updateDesign);
router.patch('/:id/sections', validate(resumeValidator.updateSections), resumeController.updateSections);

export default router;
