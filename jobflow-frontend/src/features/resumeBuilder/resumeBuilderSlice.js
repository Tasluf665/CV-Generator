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
  contact: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
  },
  summary: '',
  workExperience: [],
  education: [],
  skills: [],
  projects: [],
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
    updateSummary: (state, action) => {
      state.resumeData.summary = action.payload;
    },
    addWorkExperience: (state) => {
      const newId = Date.now(); // Use timestamp for unique temporary ID
      state.resumeData.workExperience.push({
        id: newId,
        company: '',
        role: '',
        startDate: '',
        endDate: '',
        description: '',
      });
    },
    updateWorkExperience: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.resumeData.workExperience.findIndex(w => w.id === id);
      if (index !== -1) {
        state.resumeData.workExperience[index] = { ...state.resumeData.workExperience[index], ...updates };
      }
    },
    removeWorkExperience: (state, action) => {
      state.resumeData.workExperience = state.resumeData.workExperience.filter(w => w.id !== action.payload);
    },
    addEducation: (state) => {
      const newId = Date.now();
      state.resumeData.education.push({
        id: newId,
        school: '',
        degree: '',
        startDate: '',
        endDate: '',
        description: '',
      });
    },

    updateEducation: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.resumeData.education.findIndex(e => e.id === id);
      if (index !== -1) {
        state.resumeData.education[index] = { ...state.resumeData.education[index], ...updates };
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

    addProject: (state) => {
      const newId = Date.now();
      state.resumeData.projects.push({
        id: newId,
        name: '',
        title: '',
        link: '',
        description: '',
      });
    },
    updateProject: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.resumeData.projects.findIndex(p => p.id === id);
      if (index !== -1) {
        state.resumeData.projects[index] = { ...state.resumeData.projects[index], ...updates };
      }
    },
    removeProject: (state, action) => {
      state.resumeData.projects = state.resumeData.projects.filter(p => p.id !== action.payload);
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
  updateSummary,
  addWorkExperience,
  updateWorkExperience,
  removeWorkExperience,
  addEducation,
  updateEducation,
  removeEducation,
  updateSkills,
  addSkill,
  updateSkill,
  removeSkill,
  addProject,
  updateProject,
  removeProject,
  setActiveTab,
  toggleSection,
  setZoomLevel,
  resetResumeState,
} = resumeBuilderSlice.actions;



export default resumeBuilderSlice.reducer;
