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
    targetTitles: {
      type: [String],
      default: [],
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
      pronouns: String,
      email: String,
      phone: String,
      linkedin: String,
      twitter: String,
      address: String,
      city: String,
      state: String,
      website: String,
      visibleFields: [String],
    },
    summary: {
      type: String,
    },
    summaries: {
      type: [String],
      default: [],
    },
    workExperience: [
      {
        isVisible: { type: Boolean, default: true },
        company: { type: String },
        isCompanyVisible: { type: Boolean, default: true },
        companyDescription: String,
        role: { type: String },
        isRoleVisible: { type: Boolean, default: true },
        positionDescription: String,
        positionType: String,
        location: String,
        isLocationVisible: { type: Boolean, default: true },
        startDate: String,
        endDate: String,
        isDateVisible: { type: Boolean, default: true },
        isCurrent: { type: Boolean, default: false },
        bullets: [
          {
            text: String,
            isVisible: { type: Boolean, default: true },
          }
        ],
        order: Number,
      },
    ],
    education: [
      {
        isVisible: { type: Boolean, default: true },
        institution: { type: String },
        isInstitutionVisible: { type: Boolean, default: true },
        degree: String,
        isDegreeVisible: { type: Boolean, default: true },
        field: String,
        isFieldVisible: { type: Boolean, default: true },
        location: String,
        isLocationVisible: { type: Boolean, default: true },
        startDate: String,
        endDate: String,
        isDateVisible: { type: Boolean, default: true },
        gpa: String,
        isGpaVisible: { type: Boolean, default: true },
        bullets: [
          {
            text: String,
            isVisible: { type: Boolean, default: true },
          }
        ],
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
        isVisible: { type: Boolean, default: true },
        name: { type: String },
        isNameVisible: { type: Boolean, default: true },
        description: String,
        techStack: [String],
        url: String,
        isUrlVisible: { type: Boolean, default: true },
        startDate: String,
        endDate: String,
        isDateVisible: { type: Boolean, default: true },
        bullets: [
          {
            text: String,
            isVisible: { type: Boolean, default: true },
          }
        ],
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
      margin: {
        type: Number,
        default: 48,
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
