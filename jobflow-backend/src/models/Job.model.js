import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'],
    },
    sourceUrl: {
      type: String,
      trim: true,
    },
    rawJobDescription: {
      type: String,
    },
    parsedData: {
      summary: String,
      requirements: [String],
      responsibilities: [String],
      extractedKeywords: [String],
      salaryRange: {
        min: Number,
        max: Number,
        currency: String,
      },
      experienceLevel: {
        type: String,
        enum: ['Entry', 'Mid', 'Senior', 'Lead', 'Executive'],
      },
    },
    status: {
      type: String,
      required: true,
      enum: [
        'Bookmarked',
        'Applied',
        'Interviewing',
        'Accepted',
        'Ghosted',
        'Closed',
      ],
      default: 'Bookmarked',
    },
    excitement: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    dateSaved: {
      type: Date,
      default: Date.now,
    },
    deadline: {
      type: Date,
    },
    dateApplied: {
      type: Date,
    },
    followUpDate: {
      type: Date,
    },
    notes: {
      type: String,
    },
    checklist: {
      type: [
        {
          task: {
            type: String,
            required: true,
          },
          isCompleted: {
            type: Boolean,
            default: false,
          },
          order: Number,
        },
      ],
      default: [
        { task: 'Research the company', order: 1 },
        { task: 'Tailor resume', order: 2 },
        { task: 'Write cover letter', order: 3 },
        { task: 'Apply on company website', order: 4 },
        { task: 'Follow up', order: 5 },
      ],
    },
    contacts: [
      {
        name: {
          type: String,
          required: true,
        },
        role: String,
        email: String,
        linkedinUrl: String,
        notes: String,
      },
    ],
    emailTemplates: [
      {
        subject: {
          type: String,
          required: true,
        },
        body: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ['Outreach', 'Follow-up', 'Thank-you', 'Other'],
        },
      },
    ],
    attachedResumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
jobSchema.index({ userId: 1, status: 1 });
jobSchema.index({ userId: 1, dateSaved: -1 });

const Job = mongoose.model('Job', jobSchema);

export default Job;
