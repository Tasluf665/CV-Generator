import api from './api';

const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  if (response.data.data.accessToken) {
    localStorage.setItem('accessToken', response.data.data.accessToken);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
  }
  return response.data;
};

const logout = async () => {
  const response = await api.post('/auth/logout');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  return response.data;
};

const forgotPassword = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

const resetPassword = async (token, newPassword) => {
  const response = await api.post('/auth/reset-password', { token, newPassword });
  return response.data;
};

const verifyEmail = async (token) => {
  const response = await api.get(`/auth/verify-email?token=${token}`);
  return response.data;
};

const resendVerification = async (email) => {
  const response = await api.post('/auth/resend-verification', { email });
  return response.data;
};

const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  getMe,
};

export default authService;
