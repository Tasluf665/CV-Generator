const express = require('express');
const { generateCoverLetter } = require('../controllers/coverLetter.controller');
const { verifyJWT } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(verifyJWT);

router.post('/generate', generateCoverLetter);

module.exports = router;
