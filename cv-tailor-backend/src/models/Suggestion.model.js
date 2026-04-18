const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema(
  {
    cv: { type: mongoose.Schema.Types.ObjectId, ref: 'CV', required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    suggestions: [
      {
        section: String,
        originalText: String,
        suggestedText: String,
        rationale: String,
      },
    ],
    isApplied: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Suggestion', suggestionSchema);
