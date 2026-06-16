import api from './axiosClient.js';

export const loginUser = (payload) => api.post('/auth/login', payload);
export const registerUser = (payload) => api.post('/auth/register', payload);
export const verifyOtp = (payload) => api.post('/auth/verify-otp', payload);
export const googleLogin = (payload) => api.post('/auth/google', payload);
export const refreshAccessToken = () => api.post('/auth/refresh-token');
export const forgotPassword = (payload) => api.post('/auth/forgot-password', payload);
export const resetPassword = (payload) => api.post('/auth/reset-password', payload);
export const fetchProfile = () => api.get('/users/me');
