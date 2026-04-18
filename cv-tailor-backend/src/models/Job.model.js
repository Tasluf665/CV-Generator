const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobTitle: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String },
    status: {
      type: String,
      enum: ['interested', 'applied', 'interviewing', 'offered', 'rejected'],
      default: 'interested',
    },
    meta: {
      keySkills: [String],
      salaryRange: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
