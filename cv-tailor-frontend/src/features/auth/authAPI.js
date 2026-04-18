import axiosInstance from '../../services/axiosInstance';

export const loginAPI = async (credentials) => {
  const response = await axiosInstance.post('/auth/login', credentials);
  return response.data;
};

export const registerAPI = async (userData) => {
  const response = await axiosInstance.post('/auth/register', userData);
  return response.data;
};
