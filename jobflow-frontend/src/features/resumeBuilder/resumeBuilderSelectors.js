export const selectResumes = (state) => state.resumeBuilder.resumes;
export const selectResumeData = (state) => state.resumeBuilder.resumeData;
export const selectResumeTitle = (state) => state.resumeBuilder.resumeData.title;
export const selectContactInfo = (state) => state.resumeBuilder.resumeData.contact;
export const selectTargetTitles = (state) => state.resumeBuilder.resumeData.targetTitles;
export const selectTargetJobTitle = (state) => state.resumeBuilder.resumeData.targetJobTitle;
export const selectSummary = (state) => state.resumeBuilder.resumeData.summary;
export const selectSummaries = (state) => state.resumeBuilder.resumeData.summaries;
export const selectWorkExperience = (state) => state.resumeBuilder.resumeData.workExperience;
export const selectEducation = (state) => state.resumeBuilder.resumeData.education;
export const selectSkills = (state) => state.resumeBuilder.resumeData.skills;
export const selectProjects = (state) => state.resumeBuilder.resumeData.projects;
export const selectDesign = (state) => state.resumeBuilder.resumeData.design;
export const selectSectionOrder = (state) => state.resumeBuilder.resumeData.sectionOrder;
export const selectCustomSections = (state) => state.resumeBuilder.resumeData.customSections;


export const selectActiveTab = (state) => state.resumeBuilder.ui.activeTab;
export const selectExpandedSections = (state) => state.resumeBuilder.ui.expandedSections;
export const selectZoomLevel = (state) => state.resumeBuilder.ui.zoomLevel;

export const selectCurrentResumeId = (state) => state.resumeBuilder.currentResumeId;
export const selectIsLoading = (state) => state.resumeBuilder.loading;
export const selectIsSaving = (state) => state.resumeBuilder.saving;
export const selectResumeError = (state) => state.resumeBuilder.error;
export const selectLastSaved = (state) => state.resumeBuilder.lastSaved;

export const selectIsSectionExpanded = (state, section) => 
  state.resumeBuilder.ui.expandedSections.includes(section);

export const selectSelectedJobId = (state) => state.resumeBuilder.ui.selectedJobId;
export const selectMatchResults = (state) => state.resumeBuilder.matchResults;
export const selectMatchLoading = (state) => state.resumeBuilder.matchLoading;

export const selectResumeKeywords = (state) => state.resumeBuilder.resumeData.extractedKeywords;
export const selectGenerateKeywordsLoading = (state) => state.resumeBuilder.generateKeywordsLoading;

// Cover Letter selectors
export const selectCoverLetter = (state) => state.resumeBuilder.coverLetter;
export const selectCLPrompts = (state) => state.resumeBuilder.coverLetter.prompts;
export const selectCLActivePromptIndex = (state) => state.resumeBuilder.coverLetter.activePromptIndex;
export const selectCLSelectedJobId = (state) => state.resumeBuilder.coverLetter.selectedJobId;
export const selectCLContent = (state) => state.resumeBuilder.coverLetter.generatedContent;
export const selectCLLoading = (state) => state.resumeBuilder.coverLetter.loading;
export const selectCLError = (state) => state.resumeBuilder.coverLetter.error;
export const selectCLSavedId = (state) => state.resumeBuilder.coverLetter.savedCoverLetterId;
