import api from './api';

/**
 * Maps frontend resume data to backend schema format
 */
const mapToBackend = (data) => {
  const { contact, title, ...rest } = data;
  
  // Split fullName into firstName and lastName
  const [firstName = '', ...lastNames] = (contact?.fullName || '').split(' ');
  const lastName = lastNames.join(' ');

  return {
    ...rest,
    title: title || 'Untitled Resume',
    contact: {
      firstName,
      lastName,
      email: contact?.email,
      phone: contact?.phone,
      location: contact?.location,
      linkedinUrl: contact?.linkedin,
      portfolioUrl: contact?.website,
    },
    targetJobTitle: contact?.title, // Move title from contact to targetJobTitle
    workExperience: (data.workExperience || []).map(job => ({
      company: job.company,
      role: job.role,
      location: job.location,
      startDate: job.startDate,
      endDate: job.endDate,
      bullets: job.description ? job.description.split('\n') : [],
    })),
    education: (data.education || []).map(edu => ({
      institution: edu.school,
      degree: edu.degree,
      startDate: edu.startDate,
      endDate: edu.endDate,
      bullets: edu.description ? edu.description.split('\n') : [],
    })),


    projects: (data.projects || []).map(p => ({
      name: p.name,
      description: p.title, // Map frontend "Title" to backend "description"
      url: p.link, // Map frontend "Link" to backend "url"
      bullets: p.description ? p.description.split('\n') : [], // Map frontend "Description" to backend "bullets"
    })),
    skills: (data.skills || []).map(s => ({
      category: s.category,
      items: typeof s.items === 'string' ? s.items.split(',').map(item => item.trim()).filter(Boolean) : s.items,
    })),

  };
};


/**
 * Maps backend resume data to frontend format
 */
const mapToFrontend = (data) => {
  if (!data) return null;
  const { contact, targetJobTitle, title, ...rest } = data;
  
  return {
    ...rest,
    title: title || 'Untitled Resume',
    contact: {
      fullName: `${contact?.firstName || ''} ${contact?.lastName || ''}`.trim(),
      title: targetJobTitle || '',
      email: contact?.email || '',
      phone: contact?.phone || '',
      location: contact?.location || '',
      linkedin: contact?.linkedinUrl || '',
      website: contact?.portfolioUrl || '',
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
      title: p.description || '', // Map backend "description" to frontend "Title"
      link: p.url || '', // Map backend "url" to frontend "Link"
      description: (p.bullets || []).join('\n'), // Map backend "bullets" to frontend "Description"
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
