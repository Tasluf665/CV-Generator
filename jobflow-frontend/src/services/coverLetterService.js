import api from './api';

const coverLetterService = {
  generate: async ({ resumeId, jobId, prompt, tone = 'Professional', length = 'Standard' }) => {
    const response = await api.post('/cover-letters/generate', {
      resumeId,
      jobId,
      prompt,
      tone,
      length,
    });
    return response.data;
  },

  update: async (id, { content, title }) => {
    const response = await api.patch(`/cover-letters/${id}`, { content, title });
    return response.data;
  },

  getByResumeId: async (resumeId) => {
    const response = await api.get(`/cover-letters?resumeId=${resumeId}`);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/cover-letters');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/cover-letters/${id}`);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/cover-letters/${id}`);
    return response.data;
  },
};

export default coverLetterService;
