import api from './axiosClient.js';

export const fetchUsers = () => api.get('/admin/users');
export const toggleBanUser = (userId) => api.patch(`/admin/users/${userId}/ban`);
