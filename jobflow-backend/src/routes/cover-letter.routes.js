import express from 'express';
import * as coverLetterController from '../controllers/cover-letter.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import * as coverLetterValidator from '../validators/cover-letter.validator.js';

const router = express.Router();

// All cover letter routes are protected
router.use(verifyJWT);

router.get('/', coverLetterController.getAllCoverLetters);
router.post('/generate', validate(coverLetterValidator.generateCoverLetter), coverLetterController.generateCoverLetter);

router.get('/:id', coverLetterController.getCoverLetterById);
router.patch('/:id', validate(coverLetterValidator.updateCoverLetter), coverLetterController.updateCoverLetter);
router.delete('/:id', coverLetterController.deleteCoverLetter);

export default router;
