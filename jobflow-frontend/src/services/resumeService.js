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
      company: job.company,
      role: job.role,
      location: job.location,
      startDate: job.startDate,
      endDate: job.endDate,
      bullets: typeof job.description === 'string' ? job.description.split('\n') : job.bullets || [],
    })),
    education: (data.education || []).map(edu => ({
      institution: edu.school,
      degree: edu.degree,
      startDate: edu.startDate,
      endDate: edu.endDate,
      bullets: typeof edu.description === 'string' ? edu.description.split('\n') : edu.bullets || [],
    })),
    projects: (data.projects || []).map(p => ({
      name: p.name,
      description: p.title || '', 
      url: p.link || '', 
      bullets: typeof p.description === 'string' ? p.description.split('\n') : p.bullets || [], 
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
    targetJobTitle: data.targetJobTitle || '',
    targetTitles: data.targetTitles || [],
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
      company: job.company || '',
      role: job.role || '',
      location: job.location || '',
      startDate: job.startDate || '',
      endDate: job.endDate || '',
      description: (job.bullets || []).join('\n'),
    })),
    education: (rest.education || []).map(edu => ({
      id: edu._id || Date.now() + Math.random(),
      school: edu.institution || '',
      degree: edu.degree || '',
      startDate: edu.startDate || '',
      endDate: edu.endDate || '',
      description: (edu.bullets || []).join('\n'),
    })),
    projects: (rest.projects || []).map(p => ({
      id: p._id || Date.now() + Math.random(),
      name: p.name || '',
      title: p.description || '', 
      link: p.url || '', 
      description: (p.bullets || []).join('\n'), 
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
};

export default resumeService;
