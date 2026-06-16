import api from './axiosClient.js';

export const getProfile = () => api.get('/users/me');
export const updateProfile = (payload) => api.patch('/users/me', payload);
