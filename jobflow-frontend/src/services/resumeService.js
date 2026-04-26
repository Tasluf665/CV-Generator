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
    }
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
