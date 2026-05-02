import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import resumeService from '../../services/resumeService';
import coverLetterService from '../../services/coverLetterService';

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

export const duplicateResume = createAsyncThunk(
  'resumeBuilder/duplicate',
  async (id, { rejectWithValue }) => {
    try {
      const response = await resumeService.duplicateResume(id);
      if (response.success) {
        return response.data;
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

export const matchResumeWithJob = createAsyncThunk(
  'resumeBuilder/matchJob',
  async ({ id, jobId }, { rejectWithValue }) => {
    try {
      const response = await resumeService.matchResume(id, { jobId });
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const generateResumeKeywords = createAsyncThunk(
  'resumeBuilder/generateKeywords',
  async (id, { rejectWithValue }) => {
    try {
      const response = await resumeService.generateKeywords(id);
      if (response.success) {
        return response.data.extractedKeywords;
      }
      return rejectWithValue(response.message);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const generateBullet = createAsyncThunk(
  'resumeBuilder/generateBullet',
  async ({ id, keyword, positionId, sectionType, positionData }, { rejectWithValue }) => {
    try {
      const response = await resumeService.generateBullet(id, { keyword, positionId, sectionType, positionData });
      if (response.success) {
        return { bulletText: response.data.bulletText, positionId, sectionType };
      }
      return rejectWithValue(response.message);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateKeywordStatus = createAsyncThunk(
  'resumeBuilder/updateKeywordStatus',
  async ({ id, jobId, keyword, status }, { rejectWithValue }) => {
    try {
      const response = await resumeService.updateKeywordStatus(id, { jobId, keyword, status });
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update keyword status');
    }
  }
);

export const generateCoverLetterAction = createAsyncThunk(
  'resumeBuilder/generateCoverLetter',
  async ({ resumeId, jobId, prompt, tone, length }, { rejectWithValue }) => {
    try {
      const response = await coverLetterService.generate({ resumeId, jobId, prompt, tone, length });
      if (response.success) {
        return response.data.coverLetter;
      }
      return rejectWithValue(response.message);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateCoverLetterContent = createAsyncThunk(
  'resumeBuilder/updateCoverLetterContent',
  async ({ id, content }, { rejectWithValue }) => {
    try {
      const response = await coverLetterService.update(id, { content });
      if (response.success) {
        return response.data.coverLetter;
      }
      return rejectWithValue(response.message);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchCoverLettersForResume = createAsyncThunk(
  'resumeBuilder/fetchCoverLettersForResume',
  async (resumeId, { rejectWithValue }) => {
    try {
      const response = await coverLetterService.getByResumeId(resumeId);
      if (response.success) {
        return response.data.coverLetters;
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
  extractedKeywords: {
    'Hard Skills': [],
    'Soft Skills': [],
    'Others': []
  },
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
  customSections: [],
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
      selectedJobId: localStorage.getItem('selectedJobId'),
    },
    matchResults: null,
    matchLoading: false,
    generateKeywordsLoading: false,
    loading: false,
    saving: false,
    error: null,
    lastSaved: null,
    coverLetter: {
      prompts: [],
      activePromptIndex: null,
      selectedJobId: null,
      generatedContent: '',
      savedCoverLetterId: null,
      allCoverLetters: [],   // persisted cover letters for this resume
      loading: false,
      error: null,
    },
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
        items: [],
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
    addSkillItem: (state, action) => {
      const { skillId, text } = action.payload;
      const skillIndex = state.resumeData.skills.findIndex(s => s.id === skillId);
      if (skillIndex !== -1) {
        state.resumeData.skills[skillIndex].items.push({
          id: Date.now(),
          text,
          isVisible: true
        });
      }
    },
    updateSkillItem: (state, action) => {
      const { skillId, itemId, updates } = action.payload;
      const skillIndex = state.resumeData.skills.findIndex(s => s.id === skillId);
      if (skillIndex !== -1) {
        const itemIndex = state.resumeData.skills[skillIndex].items.findIndex(i => i.id === itemId);
        if (itemIndex !== -1) {
          state.resumeData.skills[skillIndex].items[itemIndex] = {
            ...state.resumeData.skills[skillIndex].items[itemIndex],
            ...updates
          };
        }
      }
    },
    removeSkillItem: (state, action) => {
      const { skillId, itemId } = action.payload;
      const skillIndex = state.resumeData.skills.findIndex(s => s.id === skillId);
      if (skillIndex !== -1) {
        state.resumeData.skills[skillIndex].items = state.resumeData.skills[skillIndex].items.filter(i => i.id !== itemId);
      }
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
    // Custom Sections Reducers
    addCustomSection: (state, action) => {
      const newId = `custom_${Date.now()}`;
      state.resumeData.customSections.push({
        id: newId,
        title: action.payload || 'New Section',
        isVisible: true,
        items: [],
        order: state.resumeData.customSections.length,
      });
    },
    updateCustomSection: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.resumeData.customSections.findIndex(s => s.id === id);
      if (index !== -1) {
        state.resumeData.customSections[index] = { ...state.resumeData.customSections[index], ...updates };
      }
    },
    removeCustomSection: (state, action) => {
      state.resumeData.customSections = state.resumeData.customSections.filter(s => s.id !== action.payload);
    },
    addCustomSectionItem: (state, action) => {
      const { sectionId, initialData } = action.payload;
      const sectionIndex = state.resumeData.customSections.findIndex(s => s.id === sectionId);
      if (sectionIndex !== -1) {
        const newItem = {
          id: `item_${Date.now()}`,
          title: initialData?.title || '',
          date: initialData?.date || '',
          isDateVisible: true,
          subtitle: initialData?.subtitle || '',
          isSubtitleVisible: true,
          bullets: initialData?.bullets || [{ text: '', isVisible: true }],
          isVisible: true,
          order: state.resumeData.customSections[sectionIndex].items.length,
        };
        state.resumeData.customSections[sectionIndex].items.push(newItem);
      }
    },
    updateCustomSectionItem: (state, action) => {
      const { sectionId, itemId, updates } = action.payload;
      const sectionIndex = state.resumeData.customSections.findIndex(s => s.id === sectionId);
      if (sectionIndex !== -1) {
        const itemIndex = state.resumeData.customSections[sectionIndex].items.findIndex(i => i.id === itemId);
        if (itemIndex !== -1) {
          state.resumeData.customSections[sectionIndex].items[itemIndex] = {
            ...state.resumeData.customSections[sectionIndex].items[itemIndex],
            ...updates
          };
        }
      }
    },
    removeCustomSectionItem: (state, action) => {
      const { sectionId, itemId } = action.payload;
      const sectionIndex = state.resumeData.customSections.findIndex(s => s.id === sectionId);
      if (sectionIndex !== -1) {
        state.resumeData.customSections[sectionIndex].items = state.resumeData.customSections[sectionIndex].items.filter(i => i.id !== itemId);
      }
    },
    addCustomSectionBullet: (state, action) => {
      const { sectionId, itemId } = action.payload;
      const sectionIndex = state.resumeData.customSections.findIndex(s => s.id === sectionId);
      if (sectionIndex !== -1) {
        const itemIndex = state.resumeData.customSections[sectionIndex].items.findIndex(i => i.id === itemId);
        if (itemIndex !== -1) {
          state.resumeData.customSections[sectionIndex].items[itemIndex].bullets.push({ text: '', isVisible: true });
        }
      }
    },
    updateCustomSectionBullet: (state, action) => {
      const { sectionId, itemId, bulletIndex, updates } = action.payload;
      const sectionIndex = state.resumeData.customSections.findIndex(s => s.id === sectionId);
      if (sectionIndex !== -1) {
        const itemIndex = state.resumeData.customSections[sectionIndex].items.findIndex(i => i.id === itemId);
        if (itemIndex !== -1) {
          const bullet = state.resumeData.customSections[sectionIndex].items[itemIndex].bullets[bulletIndex];
          if (bullet) {
            state.resumeData.customSections[sectionIndex].items[itemIndex].bullets[bulletIndex] = { ...bullet, ...updates };
          }
        }
      }
    },
    removeCustomSectionBullet: (state, action) => {
      const { sectionId, itemId, bulletIndex } = action.payload;
      const sectionIndex = state.resumeData.customSections.findIndex(s => s.id === sectionId);
      if (sectionIndex !== -1) {
        const itemIndex = state.resumeData.customSections[sectionIndex].items.findIndex(i => i.id === itemId);
        if (itemIndex !== -1) {
          state.resumeData.customSections[sectionIndex].items[itemIndex].bullets.splice(bulletIndex, 1);
        }
      }
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
    setSelectedJobId: (state, action) => {
      state.ui.selectedJobId = action.payload;
      if (action.payload) {
        localStorage.setItem('selectedJobId', action.payload);
      } else {
        localStorage.removeItem('selectedJobId');
      }
    },
    resetResumeState: (state) => {
      state.resumeData = initialResumeData;
      state.currentResumeId = null;
      state.error = null;
      state.lastSaved = null;
      state.ui.selectedJobId = null;
      state.matchResults = null;
      state.coverLetter = {
        prompts: [],
        activePromptIndex: null,
        selectedJobId: null,
        generatedContent: '',
        savedCoverLetterId: null,
        allCoverLetters: [],
        loading: false,
        error: null,
      };
    },
    restoreCLId: (state, action) => {
      state.coverLetter.savedCoverLetterId = action.payload;
    },
    toggleKeywordMatchStatus: (state, action) => {
      const keyword = action.payload;
      if (!state.matchResults) return;

      const lowerKeyword = keyword.toLowerCase();
      const isMatched = state.matchResults.matchedKeywords?.some(k => k.toLowerCase() === lowerKeyword);
      const isMissing = state.matchResults.missingKeywords?.some(k => k.toLowerCase() === lowerKeyword);

      if (isMatched) {
        // Move to missing
        state.matchResults.matchedKeywords = state.matchResults.matchedKeywords.filter(k => k.toLowerCase() !== lowerKeyword);
        if (!state.matchResults.missingKeywords) state.matchResults.missingKeywords = [];
        state.matchResults.missingKeywords.push(keyword);

        // Remove from extractedKeywords to persist the "missing" state
        if (state.resumeData.extractedKeywords) {
          Object.keys(state.resumeData.extractedKeywords).forEach(cat => {
            if (Array.isArray(state.resumeData.extractedKeywords[cat])) {
              state.resumeData.extractedKeywords[cat] = state.resumeData.extractedKeywords[cat].filter(
                k => k.toLowerCase() !== lowerKeyword
              );
            }
          });
        }
      } else {
        // Move to matched
        if (isMissing) {
          state.matchResults.missingKeywords = state.matchResults.missingKeywords.filter(k => k.toLowerCase() !== lowerKeyword);
        }
        if (!state.matchResults.matchedKeywords) state.matchResults.matchedKeywords = [];
        state.matchResults.matchedKeywords.push(keyword);

        // Add to extractedKeywords to persist the "matched" state
        if (!state.resumeData.extractedKeywords) {
          state.resumeData.extractedKeywords = { 'Hard Skills': [], 'Soft Skills': [], 'Others': [] };
        }

        // Check if already in extractedKeywords
        const alreadyInKeywords = Object.values(state.resumeData.extractedKeywords).flat().some(
          k => k && k.toLowerCase() === lowerKeyword
        );

        if (!alreadyInKeywords) {
          if (!Array.isArray(state.resumeData.extractedKeywords['Hard Skills'])) {
            state.resumeData.extractedKeywords['Hard Skills'] = [];
          }
          state.resumeData.extractedKeywords['Hard Skills'].push(keyword);
        }
      }

      // Recalculate score
      const totalCount = (state.matchResults.matchedKeywords?.length || 0) + (state.matchResults.missingKeywords?.length || 0);
      if (totalCount > 0) {
        state.matchResults.matchScore = Math.round(((state.matchResults.matchedKeywords?.length || 0) / totalCount) * 100);
      }
    },
    // Cover Letter reducers
    setCLPrompts: (state, action) => {
      state.coverLetter.prompts = action.payload;
    },
    setCLActivePrompt: (state, action) => {
      state.coverLetter.activePromptIndex = action.payload;
    },
    setCLSelectedJob: (state, action) => {
      state.coverLetter.selectedJobId = action.payload;
    },
    setCLContent: (state, action) => {
      state.coverLetter.generatedContent = action.payload;
    },
    resetCoverLetter: (state) => {
      state.coverLetter.generatedContent = '';
      state.coverLetter.savedCoverLetterId = null;
      state.coverLetter.error = null;
    },
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
        // Seed cover letter prompts from the resume's stored prompts
        if (action.payload.coverLetterPrompts?.length) {
          state.coverLetter.prompts = action.payload.coverLetterPrompts;
        }
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
      })
      // Duplicating
      .addCase(duplicateResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(duplicateResume.fulfilled, (state, action) => {
        state.loading = false;
        state.resumes.unshift(action.payload);
      })
      .addCase(duplicateResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Matching Job
      .addCase(matchResumeWithJob.pending, (state) => {
        state.matchLoading = true;
        state.error = null;
      })
      .addCase(matchResumeWithJob.fulfilled, (state, action) => {
        state.matchLoading = false;
        state.matchResults = action.payload.matchResults;
      })
      .addCase(matchResumeWithJob.rejected, (state, action) => {
        state.matchLoading = false;
        state.error = action.payload;
      })
      // Generating Keywords
      .addCase(generateResumeKeywords.pending, (state) => {
        state.generateKeywordsLoading = true;
        state.error = null;
      })
      .addCase(generateResumeKeywords.fulfilled, (state, action) => {
        state.generateKeywordsLoading = false;
        state.resumeData.extractedKeywords = action.payload;
      })
      .addCase(generateResumeKeywords.rejected, (state, action) => {
        state.generateKeywordsLoading = false;
        state.error = action.payload;
      })
      // updateKeywordStatus
      .addCase(updateKeywordStatus.fulfilled, (state, action) => {
        if (action.payload.matchResults) {
          state.matchResults = action.payload.matchResults;
        }
        if (action.payload.extractedKeywords) {
          state.resumeData.extractedKeywords = action.payload.extractedKeywords;
        }
      })
      // Generate Cover Letter
      .addCase(generateCoverLetterAction.pending, (state) => {
        state.coverLetter.loading = true;
        state.coverLetter.error = null;
      })
      .addCase(generateCoverLetterAction.fulfilled, (state, action) => {
        state.coverLetter.loading = false;
        state.coverLetter.generatedContent = action.payload.content;
        state.coverLetter.savedCoverLetterId = action.payload._id;
      })
      .addCase(generateCoverLetterAction.rejected, (state, action) => {
        state.coverLetter.loading = false;
        state.coverLetter.error = action.payload;
      })
      // Update Cover Letter
      .addCase(updateCoverLetterContent.fulfilled, (state, action) => {
        state.coverLetter.generatedContent = action.payload.content;
        // Also update in allCoverLetters list
        const idx = state.coverLetter.allCoverLetters.findIndex(cl => cl._id === action.payload._id);
        if (idx !== -1) state.coverLetter.allCoverLetters[idx] = action.payload;
      })
      // Fetch Cover Letters for Resume
      .addCase(fetchCoverLettersForResume.fulfilled, (state, action) => {
        state.coverLetter.allCoverLetters = action.payload;
        // If a jobId is already selected, hydrate content from existing cover letters
        if (state.coverLetter.selectedJobId && !state.coverLetter.generatedContent) {
          const match = action.payload.find(
            cl => cl.jobId?._id === state.coverLetter.selectedJobId ||
                  cl.jobId === state.coverLetter.selectedJobId
          );
          if (match) {
            state.coverLetter.generatedContent = match.content;
            state.coverLetter.savedCoverLetterId = match._id;
          }
        }
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
  addSkillItem,
  updateSkillItem,
  removeSkillItem,
  addProject,
  updateProject,
  addProjectBullet,
  updateProjectBullet,
  removeProjectBullet,
  removeProject,
  setActiveTab,
  toggleSection,
  setZoomLevel,
  setSelectedJobId,
  resetResumeState,
  toggleKeywordMatchStatus,
  updateDesign,
  setCLPrompts,
  setCLActivePrompt,
  setCLSelectedJob,
  setCLContent,
  resetCoverLetter,
  restoreCLId,
  addCustomSection,
  updateCustomSection,
  removeCustomSection,
  addCustomSectionItem,
  updateCustomSectionItem,
  removeCustomSectionItem,
  addCustomSectionBullet,
  updateCustomSectionBullet,
  removeCustomSectionBullet,
} = resumeBuilderSlice.actions;

export default resumeBuilderSlice.reducer;
