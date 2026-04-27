import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import resumeService from '../../services/resumeService';

export const fetchAllResumes = createAsyncThunk(
  'resumeBuilder/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await resumeService.getAllResumes();
      if (response.success) {
        return response.data.resumes;
      }
      return rejectWithValue(response.message);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteResume = createAsyncThunk(
  'resumeBuilder/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await resumeService.deleteResume(id);
      if (response.success) {
        return id;
      }
      return rejectWithValue(response.message);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchResumeById = createAsyncThunk(
  'resumeBuilder/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await resumeService.getResumeById(id);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const saveResume = createAsyncThunk(
  'resumeBuilder/save',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      let response;
      if (id && id !== 'new') {
        response = await resumeService.updateResume(id, data);
      } else {
        response = await resumeService.createResume(data);
      }
      
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialResumeData = {
  title: 'Untitled Resume',
  targetJobTitle: '',
  targetTitles: [],
  contact: {
    firstName: '',
    lastName: '',
    pronouns: '',
    email: '',
    phone: '',
    linkedin: '',
    twitter: '',
    address: '',
    city: '',
    state: '',
    website: '',
    visibleFields: ['firstName', 'lastName', 'email', 'phone', 'linkedin', 'twitter', 'address', 'city', 'state', 'website'],
  },
  summary: '',
  summaries: [],
  workExperience: [],
  education: [],
  skills: [],
  projects: [],
  design: {
    template: 'modern',
    font: 'Inter',
    lineHeight: 140,
    listLineHeight: 120,
    accentColor: '#00b894',
    dateFormat: 'MM/YYYY',
    margin: 48,
    fontSize: 14,
    sectionStyles: {
      title: { fontSize: 24, fontFamily: 'Inter', color: '#2d3436', margin: 10, lineHeight: 120, letterSpacing: 0, alignment: 'left' },
      summary: { fontSize: 14, fontFamily: 'Inter', color: '#506169', margin: 10, lineHeight: 140, letterSpacing: 0, alignment: 'left' },
      experience: { fontSize: 14, fontFamily: 'Inter', color: '#2d3436', margin: 15, lineHeight: 140, letterSpacing: 0, alignment: 'left' },
      education: { fontSize: 14, fontFamily: 'Inter', color: '#2d3436', margin: 15, lineHeight: 140, letterSpacing: 0, alignment: 'left' },
      projects: { fontSize: 14, fontFamily: 'Inter', color: '#2d3436', margin: 15, lineHeight: 140, letterSpacing: 0, alignment: 'left' },
      skills: { fontSize: 14, fontFamily: 'Inter', color: '#2d3436', margin: 10, lineHeight: 140, letterSpacing: 0, alignment: 'left' },
      contact: { fontSize: 13, fontFamily: 'Inter', color: '#506169', margin: 10, lineHeight: 140, letterSpacing: 0, alignment: 'center' },
    }
  },
};



const resumeBuilderSlice = createSlice({
  name: 'resumeBuilder',
  initialState: {
    currentResumeId: null,
    resumes: [],
    resumeData: initialResumeData,
    ui: {

      activeTab: 'content',
      expandedSections: ['contact', 'work'],
      zoomLevel: 100,
    },
    loading: false,
    saving: false,
    error: null,
    lastSaved: null,
  },
  reducers: {
    setResumeData: (state, action) => {
      state.resumeData = action.payload;
    },
    updateResumeTitle: (state, action) => {
      state.resumeData.title = action.payload;
    },
    updateContact: (state, action) => {

      state.resumeData.contact = { ...state.resumeData.contact, ...action.payload };
    },
    updateTargetTitles: (state, action) => {
      state.resumeData.targetTitles = action.payload;
    },
    setTargetJobTitle: (state, action) => {
      state.resumeData.targetJobTitle = action.payload;
    },
    updateSummary: (state, action) => {
      state.resumeData.summary = action.payload;
    },
    updateSummaries: (state, action) => {
      state.resumeData.summaries = action.payload;
    },
    addWorkExperience: (state, action) => {
      const newId = Date.now();
      const initialData = action.payload || {};
      state.resumeData.workExperience.push({
        id: newId,
        isVisible: initialData.isVisible ?? true,
        company: initialData.company || '',
        isCompanyVisible: initialData.isCompanyVisible ?? true,
        companyDescription: initialData.companyDescription || '',
        role: initialData.role || '',
        isRoleVisible: initialData.isRoleVisible ?? true,
        positionDescription: initialData.positionDescription || '',
        positionType: initialData.positionType || '',
        location: initialData.location || '',
        isLocationVisible: initialData.isLocationVisible ?? true,
        startDate: initialData.startDate || '',
        endDate: initialData.endDate || '',
        isDateVisible: initialData.isDateVisible ?? true,
        isCurrent: initialData.isCurrent ?? false,
        bullets: initialData.bullets || [{ text: '', isVisible: true }],
        order: state.resumeData.workExperience.length,
      });
    },
    updateWorkExperience: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.resumeData.workExperience.findIndex(w => w.id === id);
      if (index !== -1) {
        state.resumeData.workExperience[index] = { ...state.resumeData.workExperience[index], ...updates };
      }
    },
    addWorkBullet: (state, action) => {
      const { jobId } = action.payload;
      const jobIndex = state.resumeData.workExperience.findIndex(w => w.id === jobId);
      if (jobIndex !== -1) {
        state.resumeData.workExperience[jobIndex].bullets.push({ text: '', isVisible: true });
      }
    },
    updateWorkBullet: (state, action) => {
      const { jobId, bulletIndex, updates } = action.payload;
      const jobIndex = state.resumeData.workExperience.findIndex(w => w.id === jobId);
      if (jobIndex !== -1) {
        const bullet = state.resumeData.workExperience[jobIndex].bullets[bulletIndex];
        if (bullet) {
          state.resumeData.workExperience[jobIndex].bullets[bulletIndex] = { ...bullet, ...updates };
        }
      }
    },
    removeWorkBullet: (state, action) => {
      const { jobId, bulletIndex } = action.payload;
      const jobIndex = state.resumeData.workExperience.findIndex(w => w.id === jobId);
      if (jobIndex !== -1) {
        state.resumeData.workExperience[jobIndex].bullets.splice(bulletIndex, 1);
      }
    },
    removeWorkExperience: (state, action) => {
      state.resumeData.workExperience = state.resumeData.workExperience.filter(w => w.id !== action.payload);
    },
    addEducation: (state, action) => {
      const newId = Date.now();
      const initialData = action.payload || {};
      state.resumeData.education.push({
        id: newId,
        isVisible: initialData.isVisible ?? true,
        school: initialData.school || '',
        isInstitutionVisible: initialData.isInstitutionVisible ?? true,
        degree: initialData.degree || '',
        isDegreeVisible: initialData.isDegreeVisible ?? true,
        field: initialData.field || '',
        isFieldVisible: initialData.isFieldVisible ?? true,
        location: initialData.location || '',
        isLocationVisible: initialData.isLocationVisible ?? true,
        startDate: initialData.startDate || '',
        endDate: initialData.endDate || '',
        isDateVisible: initialData.isDateVisible ?? true,
        gpa: initialData.gpa || '',
        isGpaVisible: initialData.isGpaVisible ?? true,
        bullets: initialData.bullets || [{ text: '', isVisible: true }],
        order: state.resumeData.education.length,
      });
    },
    updateEducation: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.resumeData.education.findIndex(e => e.id === id);
      if (index !== -1) {
        state.resumeData.education[index] = { ...state.resumeData.education[index], ...updates };
      }
    },
    addEduBullet: (state, action) => {
      const { eduId } = action.payload;
      const eduIndex = state.resumeData.education.findIndex(e => e.id === eduId);
      if (eduIndex !== -1) {
        state.resumeData.education[eduIndex].bullets.push({ text: '', isVisible: true });
      }
    },
    updateEduBullet: (state, action) => {
      const { eduId, bulletIndex, updates } = action.payload;
      const eduIndex = state.resumeData.education.findIndex(e => e.id === eduId);
      if (eduIndex !== -1) {
        const bullet = state.resumeData.education[eduIndex].bullets[bulletIndex];
        if (bullet) {
          state.resumeData.education[eduIndex].bullets[bulletIndex] = { ...bullet, ...updates };
        }
      }
    },
    removeEduBullet: (state, action) => {
      const { eduId, bulletIndex } = action.payload;
      const eduIndex = state.resumeData.education.findIndex(e => e.id === eduId);
      if (eduIndex !== -1) {
        state.resumeData.education[eduIndex].bullets.splice(bulletIndex, 1);
      }
    },
    removeEducation: (state, action) => {
      state.resumeData.education = state.resumeData.education.filter(e => e.id !== action.payload);
    },
    updateSkills: (state, action) => {
      state.resumeData.skills = action.payload;
    },
    addSkill: (state) => {
      state.resumeData.skills.push({
        id: Date.now(),
        category: '',
        items: '',
      });
    },
    updateSkill: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.resumeData.skills.findIndex(s => s.id === id);
      if (index !== -1) {
        state.resumeData.skills[index] = { ...state.resumeData.skills[index], ...updates };
      }
    },
    removeSkill: (state, action) => {
      state.resumeData.skills = state.resumeData.skills.filter(s => s.id !== action.payload);
    },

    addProject: (state, action) => {
      const newId = Date.now();
      const initialData = action.payload || {};
      state.resumeData.projects.push({
        id: newId,
        isVisible: initialData.isVisible ?? true,
        name: initialData.name || '',
        isNameVisible: initialData.isNameVisible ?? true,
        title: initialData.title || '', // maps to backend description
        link: initialData.link || '', // maps to backend url
        isUrlVisible: initialData.isUrlVisible ?? true,
        startDate: initialData.startDate || '',
        endDate: initialData.endDate || '',
        isDateVisible: initialData.isDateVisible ?? true,
        bullets: initialData.bullets || [{ text: '', isVisible: true }],
        order: state.resumeData.projects.length,
      });
    },
    updateProject: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.resumeData.projects.findIndex(p => p.id === id);
      if (index !== -1) {
        state.resumeData.projects[index] = { ...state.resumeData.projects[index], ...updates };
      }
    },
    addProjectBullet: (state, action) => {
      const { projectId } = action.payload;
      const index = state.resumeData.projects.findIndex(p => p.id === projectId);
      if (index !== -1) {
        state.resumeData.projects[index].bullets.push({ text: '', isVisible: true });
      }
    },
    updateProjectBullet: (state, action) => {
      const { projectId, bulletIndex, updates } = action.payload;
      const index = state.resumeData.projects.findIndex(p => p.id === projectId);
      if (index !== -1) {
        const bullet = state.resumeData.projects[index].bullets[bulletIndex];
        if (bullet) {
          state.resumeData.projects[index].bullets[bulletIndex] = { ...bullet, ...updates };
        }
      }
    },
    removeProjectBullet: (state, action) => {
      const { projectId, bulletIndex } = action.payload;
      const index = state.resumeData.projects.findIndex(p => p.id === projectId);
      if (index !== -1) {
        state.resumeData.projects[index].bullets.splice(bulletIndex, 1);
      }
    },
    removeProject: (state, action) => {
      state.resumeData.projects = state.resumeData.projects.filter(p => p.id !== action.payload);
    },
    updateDesign: (state, action) => {
      state.resumeData.design = { ...state.resumeData.design, ...action.payload };
    },

    setActiveTab: (state, action) => {
      state.ui.activeTab = action.payload;
    },
    toggleSection: (state, action) => {
      const section = action.payload;
      if (state.ui.expandedSections.includes(section)) {
        state.ui.expandedSections = state.ui.expandedSections.filter(s => s !== section);
      } else {
        state.ui.expandedSections.push(section);
      }
    },
    setZoomLevel: (state, action) => {
      state.ui.zoomLevel = action.payload;
    },
    resetResumeState: (state) => {
      state.resumeData = initialResumeData;
      state.currentResumeId = null;
      state.error = null;
      state.lastSaved = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetching All
      .addCase(fetchAllResumes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllResumes.fulfilled, (state, action) => {
        state.loading = false;
        state.resumes = action.payload;
      })
      .addCase(fetchAllResumes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetching Single
      .addCase(fetchResumeById.pending, (state) => {

        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResumeById.fulfilled, (state, action) => {
        state.loading = false;
        state.resumeData = action.payload;
        state.currentResumeId = action.payload._id;
      })
      .addCase(fetchResumeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Saving
      .addCase(saveResume.pending, (state) => {
        state.saving = true;
      })
      .addCase(saveResume.fulfilled, (state, action) => {
        state.saving = false;
        state.lastSaved = new Date().toISOString();
        if (!state.currentResumeId) {
          state.currentResumeId = action.payload._id;
          state.resumeData._id = action.payload._id; // Ensure ID is in data too
        }
      })
      .addCase(saveResume.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      // Deleting
      .addCase(deleteResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteResume.fulfilled, (state, action) => {
        state.loading = false;
        state.resumes = state.resumes.filter(r => r._id !== action.payload);
        if (state.currentResumeId === action.payload) {
          state.currentResumeId = null;
          state.resumeData = initialResumeData;
        }
      })
      .addCase(deleteResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export const {
  setResumeData,
  updateResumeTitle,
  updateContact,
  updateTargetTitles,
  setTargetJobTitle,
  updateSummary,
  updateSummaries,
  addWorkExperience,
  updateWorkExperience,
  addWorkBullet,
  updateWorkBullet,
  removeWorkBullet,
  removeWorkExperience,
  addEducation,
  updateEducation,
  addEduBullet,
  updateEduBullet,
  removeEduBullet,
  removeEducation,
  updateSkills,
  addSkill,
  updateSkill,
  removeSkill,
  addProject,
  updateProject,
  addProjectBullet,
  updateProjectBullet,
  removeProjectBullet,
  removeProject,
  setActiveTab,
  toggleSection,
  setZoomLevel,
  resetResumeState,
  updateDesign,
} = resumeBuilderSlice.actions;



export default resumeBuilderSlice.reducer;
