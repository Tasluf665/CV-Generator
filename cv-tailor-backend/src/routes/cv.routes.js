const express = require('express');
const { createCV, getCVs } = require('../controllers/cv.controller');
const { verifyJWT } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(verifyJWT); // Protect all CV routes

router.route('/').post(createCV).get(getCVs);

module.exports = router;
