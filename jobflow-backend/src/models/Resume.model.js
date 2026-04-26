import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      default: 'Untitled Resume',
      trim: true,
    },
    targetJobTitle: {
      type: String,
      trim: true,
    },
    linkedJobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      index: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    contact: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      location: String,
      linkedinUrl: String,
      githubUrl: String,
      portfolioUrl: String,
    },
    summary: {
      type: String,
    },
    workExperience: [
      {
        company: { type: String },
        role: { type: String },

        location: String,
        startDate: String,
        endDate: String,
        isCurrent: { type: Boolean, default: false },
        bullets: [String],
        order: Number,
      },
    ],
    education: [
      {
        institution: { type: String },

        degree: String,
        field: String,
        location: String,
        startDate: String,
        endDate: String,
        gpa: String,
        bullets: [String],
        order: Number,
      },
    ],
    skills: [
      {
        category: String,
        items: [String],
      },
    ],
    projects: [
      {
        name: { type: String },

        description: String,
        techStack: [String],
        url: String,
        startDate: String,
        endDate: String,
        bullets: [String],
        order: Number,
      },
    ],
    certifications: [
      {
        name: { type: String, required: true },
        issuer: String,
        date: String,
        url: String,
      },
    ],
    awards: [
      {
        title: { type: String, required: true },
        issuer: String,
        date: String,
        description: String,
      },
    ],
    volunteering: [
      {
        organization: { type: String, required: true },
        role: String,
        startDate: String,
        endDate: String,
        bullets: [String],
      },
    ],
    publications: [
      {
        title: { type: String, required: true },
        publisher: String,
        date: String,
        url: String,
      },
    ],
    sectionOrder: {
      type: [String],
      default: [
        'summary',
        'workExperience',
        'education',
        'skills',
        'projects',
        'certifications',
        'awards',
        'volunteering',
        'publications',
      ],
    },
    hiddenSections: [String],
    design: {
      template: { type: String, default: 'classic' },
      font: { type: String, default: 'Poppins' },
      accentColor: { type: String, default: '#00b894' },
      lineHeight: { type: Number, default: 120 },
      listLineHeight: { type: Number, default: 120 },
      fontSize: { type: Number, default: 13 },
      margins: {
        type: String,
        enum: ['narrow', 'normal', 'wide'],
        default: 'normal',
      },
      dateFormat: {
        type: String,
        enum: ['MM/YYYY', 'Month YYYY', 'YYYY'],
        default: 'MM/YYYY',
      },
    },
    analysis: {
      score: Number,
      issues: [
        {
          type: { type: String, enum: ['error', 'warning', 'pass'] },
          category: String,
          title: String,
          description: String,
          affectedSection: String,
        },
      ],
      analyzedAt: Date,
    },
    matchResults: [
      {
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
        matchScore: Number,
        matchedKeywords: [String],
        missingKeywords: [String],
        suggestions: [String],
        analyzedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound index for sorting recent resumes
resumeSchema.index({ userId: 1, updatedAt: -1 });

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
