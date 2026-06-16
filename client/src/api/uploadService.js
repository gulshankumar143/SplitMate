import api from './axiosClient.js';

export const uploadFile = async (file) => {
  const payload = new FormData();
  payload.append('file', file);
  const response = await api.post('/uploads/file', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
  return response.data.data.attachment;
};

export const uploadAvatar = async (file) => {
  const payload = new FormData();
  payload.append('file', file);
  const response = await api.post('/uploads/avatar', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
  return response.data.data;
};
