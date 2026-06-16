import api from './axiosClient.js';

export const fetchFriends = () => api.get('/friends');
export const fetchFriendRequests = () => api.get('/friends/requests');
export const sendFriendRequest = (payload) => api.post('/friends/request', payload);
export const respondFriendRequest = (payload) => api.patch('/friends/respond', payload);
export const searchFriends = (query) => api.get(`/friends/search?q=${encodeURIComponent(query)}`);
export const removeFriend = (friendId) => api.delete(`/friends/${friendId}`);
