const mongoose = require('mongoose');

const cvSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: 'My CV' },
    summary: { type: String },
    experience: [
      {
        company: String,
        role: String,
        fromDate: String,
        toDate: String,
        description: String,
        isCurrent: Boolean,
      },
    ],
    education: [
      {
        institution: String,
        degree: String,
        fromDate: String,
        toDate: String,
        description: String,
      },
    ],
    skills: [String],
    projects: [
      {
        name: String,
        description: String,
        link: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('CV', cvSchema);
