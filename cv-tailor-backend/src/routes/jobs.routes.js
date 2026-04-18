const express = require('express');
const { addJob, getJobs } = require('../controllers/jobs.controller');
const { verifyJWT } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(verifyJWT);

router.route('/').post(addJob).get(getJobs);

module.exports = router;
