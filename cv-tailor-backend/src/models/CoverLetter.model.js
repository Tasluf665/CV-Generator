const mongoose = require('mongoose');

const coverLetterSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    content: { type: String, required: true },
    tone: { type: String, default: 'professional' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CoverLetter', coverLetterSchema);
