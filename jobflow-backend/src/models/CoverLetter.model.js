import mongoose from 'mongoose';

const coverLetterSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
      index: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      index: true,
    },
    title: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Cover letter content is required'],
    },
    tone: {
      type: String,
      enum: ['Professional', 'Friendly', 'Enthusiastic', 'Formal'],
      default: 'Professional',
    },
    length: {
      type: String,
      enum: ['Short', 'Standard', 'Detailed'],
      default: 'Standard',
    },
    isAiGenerated: {
      type: Boolean,
      default: true,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const CoverLetter = mongoose.model('CoverLetter', coverLetterSchema);

export default CoverLetter;
