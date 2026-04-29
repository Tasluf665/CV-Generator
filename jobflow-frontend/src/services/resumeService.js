import api from './api';

/**
 * Maps frontend resume data to backend schema format
 */
const mapToBackend = (data) => {
  const { contact, ...rest } = data;
  
  return {
    ...rest,
    targetJobTitle: data.targetJobTitle || '',
    targetTitles: data.targetTitles || [],
    summaries: data.summaries || [],
    summary: data.summary || '',
    contact: {
      firstName: contact?.firstName || '',
      lastName: contact?.lastName || '',
      pronouns: contact?.pronouns || '',
      email: contact?.email || '',
      phone: contact?.phone || '',
      linkedin: contact?.linkedin || '',
      twitter: contact?.twitter || '',
      address: contact?.address || '',
      city: contact?.city || '',
      state: contact?.state || '',
      website: contact?.website || '',
      visibleFields: contact?.visibleFields || [],
    },
    workExperience: (data.workExperience || []).map(job => ({
      isVisible: job.isVisible ?? true,
      company: job.company,
      isCompanyVisible: job.isCompanyVisible ?? true,
      companyDescription: job.companyDescription,
      role: job.role,
      isRoleVisible: job.isRoleVisible ?? true,
      positionDescription: job.positionDescription,
      positionType: job.positionType,
      location: job.location,
      isLocationVisible: job.isLocationVisible ?? true,
      startDate: job.startDate,
      endDate: job.endDate,
      isDateVisible: job.isDateVisible ?? true,
      isCurrent: job.isCurrent ?? false,
      bullets: (job.bullets || []).map(b => ({
        text: typeof b === 'string' ? b : b.text,
        isVisible: b.isVisible ?? true
      })),
      order: job.order,
    })),
    education: (data.education || []).map(edu => ({
      isVisible: edu.isVisible ?? true,
      institution: edu.school,
      isInstitutionVisible: edu.isInstitutionVisible ?? true,
      degree: edu.degree,
      isDegreeVisible: edu.isDegreeVisible ?? true,
      field: edu.field,
      isFieldVisible: edu.isFieldVisible ?? true,
      location: edu.location,
      isLocationVisible: edu.isLocationVisible ?? true,
      startDate: edu.startDate,
      endDate: edu.endDate,
      isDateVisible: edu.isDateVisible ?? true,
      gpa: edu.gpa,
      isGpaVisible: edu.isGpaVisible ?? true,
      bullets: (edu.bullets || []).map(b => ({
        text: typeof b === 'string' ? b : b.text,
        isVisible: b.isVisible ?? true
      })),
      order: edu.order,
    })),
    projects: (data.projects || []).map(p => ({
      isVisible: p.isVisible ?? true,
      name: p.name,
      isNameVisible: p.isNameVisible ?? true,
      description: p.title || '',
      url: p.link || '',
      isUrlVisible: p.isUrlVisible ?? true,
      startDate: p.startDate,
      endDate: p.endDate,
      isDateVisible: p.isDateVisible ?? true,
      bullets: (p.bullets || []).map(b => ({
        text: typeof b === 'string' ? b : b.text,
        isVisible: b.isVisible ?? true
      })),
      order: p.order,
    })),
    skills: (data.skills || []).map(s => ({
      category: s.category,
      items: typeof s.items === 'string' ? s.items.split(',').map(item => item.trim()).filter(Boolean) : s.items || [],
    })),
  };
};


const DEFAULT_VISIBLE_FIELDS = ['firstName', 'lastName', 'email', 'phone', 'linkedin', 'twitter', 'address', 'city', 'state', 'website'];

/**
 * Maps backend resume data to frontend format
 */
const mapToFrontend = (data) => {
  if (!data) return null;
  const { contact, ...rest } = data;
  
  return {
    ...rest,
    extractedKeywords: data.extractedKeywords || {
      'Hard Skills': [],
      'Soft Skills': [],
      'Others': []
    },
    targetJobTitle: data.targetJobTitle || '',
    targetTitles: data.targetTitles || [],
    summaries: data.summaries || [],
    summary: data.summary || '',
    contact: {
      firstName: contact?.firstName || '',
      lastName: contact?.lastName || '',
      pronouns: contact?.pronouns || '',
      email: contact?.email || '',
      phone: contact?.phone || '',
      linkedin: contact?.linkedin || '',
      twitter: contact?.twitter || '',
      address: contact?.address || '',
      city: contact?.city || '',
      state: contact?.state || '',
      website: contact?.website || '',
      visibleFields: (contact?.visibleFields !== undefined && contact?.visibleFields !== null)
        ? contact.visibleFields 
        : DEFAULT_VISIBLE_FIELDS,
    },
    workExperience: (rest.workExperience || []).map(job => ({
      id: job._id || Date.now() + Math.random(),
      isVisible: job.isVisible ?? true,
      company: job.company || '',
      isCompanyVisible: job.isCompanyVisible ?? true,
      companyDescription: job.companyDescription || '',
      role: job.role || '',
      isRoleVisible: job.isRoleVisible ?? true,
      positionDescription: job.positionDescription || '',
      positionType: job.positionType || '',
      location: job.location || '',
      isLocationVisible: job.isLocationVisible ?? true,
      startDate: job.startDate || '',
      endDate: job.endDate || '',
      isDateVisible: job.isDateVisible ?? true,
      isCurrent: job.isCurrent ?? false,
      bullets: (job.bullets || []).map(b => ({
        text: b.text || '',
        isVisible: b.isVisible ?? true
      })),
      order: job.order || 0,
    })),
    education: (rest.education || []).map(edu => ({
      id: edu._id || Date.now() + Math.random(),
      isVisible: edu.isVisible ?? true,
      school: edu.institution || '',
      isInstitutionVisible: edu.isInstitutionVisible ?? true,
      degree: edu.degree || '',
      isDegreeVisible: edu.isDegreeVisible ?? true,
      field: edu.field || '',
      isFieldVisible: edu.isFieldVisible ?? true,
      location: edu.location || '',
      isLocationVisible: edu.isLocationVisible ?? true,
      startDate: edu.startDate || '',
      endDate: edu.endDate || '',
      isDateVisible: edu.isDateVisible ?? true,
      gpa: edu.gpa || '',
      isGpaVisible: edu.isGpaVisible ?? true,
      bullets: (edu.bullets || []).map(b => ({
        text: b.text || '',
        isVisible: b.isVisible ?? true
      })),
      order: edu.order || 0,
    })),
    projects: (rest.projects || []).map(p => ({
      id: p._id || Date.now() + Math.random(),
      isVisible: p.isVisible ?? true,
      name: p.name || '',
      isNameVisible: p.isNameVisible ?? true,
      title: p.description || '',
      link: p.url || '',
      isUrlVisible: p.isUrlVisible ?? true,
      startDate: p.startDate || '',
      endDate: p.endDate || '',
      isDateVisible: p.isDateVisible ?? true,
      bullets: (p.bullets || []).map(b => ({
        text: b.text || '',
        isVisible: b.isVisible ?? true
      })),
      order: p.order || 0,
    })),
    skills: (rest.skills || []).map(s => ({
      id: s._id || Date.now() + Math.random(),
      category: s.category || '',
      items: (s.items || []).join(', '),
    })),
  };
};


const resumeService = {
  getAllResumes: async () => {
    const response = await api.get('/resumes');
    return response.data;
  },

  getResumeById: async (id) => {
    const response = await api.get(`/resumes/${id}`);
    if (response.data.success) {
      return {
        ...response.data,
        data: mapToFrontend(response.data.data.resume)
      };
    }
    return response.data;
  },

  createResume: async (data) => {
    // 1. Create an empty resume with the title
    const createPayload = { 
      title: data.title || 'Untitled Resume' 
    };
    const createResponse = await api.post('/resumes', createPayload);
    
    if (!createResponse.data.success) {
      return createResponse.data;
    }

    const newResume = createResponse.data.data.resume;
    const newId = newResume._id;
    
    // 2. Immediately update it with the actual content
    const updatePayload = mapToBackend(data);
    const updateResponse = await api.patch(`/resumes/${newId}`, updatePayload);
    
    if (updateResponse.data.success) {
      return {
        ...updateResponse.data,
        data: mapToFrontend(updateResponse.data.data.resume)
      };
    }
    
    // Fallback to the created (but empty content) resume if update fails
    return {
      ...createResponse.data,
      data: mapToFrontend(newResume)
    };
  },

  updateResume: async (id, data) => {
    const backendData = mapToBackend(data);
    const response = await api.patch(`/resumes/${id}`, backendData);
    if (response.data.success) {
      return {
        ...response.data,
        data: mapToFrontend(response.data.data.resume)
      };
    }
    return response.data;
  },

  deleteResume: async (id) => {
    const response = await api.delete(`/resumes/${id}`);
    return response.data;
  },

  duplicateResume: async (id) => {
    const response = await api.post(`/resumes/${id}/duplicate`);
    if (response.data.success) {
      return {
        ...response.data,
        data: mapToFrontend(response.data.data.resume)
      };
    }
    return response.data;
  },

  matchResume: async (id, jobId) => {
    const response = await api.post(`/resumes/${id}/match`, { jobId });
    return response.data;
  },

  generateKeywords: async (id) => {
    const response = await api.post(`/resumes/${id}/keywords`);
    return response.data;
  },
};

export default resumeService;
