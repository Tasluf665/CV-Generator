const express = require('express');
const { getTailoringSuggestions } = require('../controllers/tailor.controller');
const { verifyJWT } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(verifyJWT);

router.post('/analyse', getTailoringSuggestions);

module.exports = router;
