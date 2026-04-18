const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const CoverLetter = require('../models/CoverLetter.model');

const generateCoverLetter = asyncHandler(async (req, res) => {
  const { jobId, tone } = req.body;
  
  const letter = await CoverLetter.create({
    owner: req.user._id,
    job: jobId,
    content: 'Dear Hiring Manager, ...',
    tone: tone || 'professional',
  });

  return res.status(201).json(new ApiResponse(201, letter, 'Cover letter generated'));
});

module.exports = {
  generateCoverLetter,
};
