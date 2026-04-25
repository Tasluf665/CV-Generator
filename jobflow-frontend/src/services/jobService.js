import api from './api';

export const jobService = {
  getJobs: async (params = {}) => {
    const response = await api.get('/jobs', { params });
    return response.data;
  },

  createJob: async (jobData) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  scrapeJob: async (jobUrl) => {
    const response = await api.post('/jobs/scrape', { jobUrl });
    return response.data;
  },

  parseJob: async (payload) => {
    const response = await api.post('/jobs/parse', payload);
    return response.data;
  },

  getJobById: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  updateJob: async (id, jobData) => {
    const response = await api.patch(`/jobs/${id}`, jobData);
    return response.data;
  },

  deleteJob: async (id) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },
};
