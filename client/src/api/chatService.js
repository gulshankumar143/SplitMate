import api from './axiosClient.js';

export const fetchChatMessages = (roomId) => api.get(`/chat/room/${roomId}`);
export const sendChatMessage = (roomId, payload) => api.post(`/chat/room/${roomId}/message`, payload);
