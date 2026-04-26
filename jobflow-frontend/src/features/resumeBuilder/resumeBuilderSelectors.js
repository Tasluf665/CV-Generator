export const selectResumes = (state) => state.resumeBuilder.resumes;
export const selectResumeData = (state) => state.resumeBuilder.resumeData;
export const selectResumeTitle = (state) => state.resumeBuilder.resumeData.title;
export const selectContactInfo = (state) => state.resumeBuilder.resumeData.contact;
export const selectSummary = (state) => state.resumeBuilder.resumeData.summary;
export const selectWorkExperience = (state) => state.resumeBuilder.resumeData.workExperience;
export const selectEducation = (state) => state.resumeBuilder.resumeData.education;
export const selectSkills = (state) => state.resumeBuilder.resumeData.skills;

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
