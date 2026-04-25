import express from 'express';
import * as jobController from '../controllers/job.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import * as jobValidator from '../validators/job.validator.js';

const router = express.Router();

// All job routes are protected
router.use(verifyJWT);

router.get('/', jobController.getAllJobs);
router.post('/', validate(jobValidator.createJob), jobController.createJob);
router.post('/scrape', validate(jobValidator.scrapeJob), jobController.scrapeJobFromUrl);
router.post('/parse', validate(jobValidator.parseJob), jobController.parseJobDescription);

router.get('/:id', jobController.getJobById);
router.patch('/:id', validate(jobValidator.updateJob), jobController.updateJob);
router.delete('/:id', jobController.deleteJob);

router.patch('/:id/checklist', validate(jobValidator.updateChecklist), jobController.updateChecklistItem);

router.post('/:id/contacts', validate(jobValidator.addContact), jobController.addContact);
router.delete('/:id/contacts/:contactId', jobController.deleteContact);

router.post('/:id/email-templates', validate(jobValidator.addEmailTemplate), jobController.addEmailTemplate);

router.post('/:id/reparse', jobController.reparseJobDescription);

export default router;
