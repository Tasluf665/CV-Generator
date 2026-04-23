import express from 'express';
import authRoutes from './auth.routes.js';
import jobRoutes from './job.routes.js';
import resumeRoutes from './resume.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/jobs', jobRoutes);
router.use('/resumes', resumeRoutes);

export default router;
