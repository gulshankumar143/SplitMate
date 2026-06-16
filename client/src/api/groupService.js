import api from './axiosClient.js';

export const fetchGroups = () => api.get('/groups');
export const createGroup = (payload) => api.post('/groups', payload);
export const addGroupMember = (payload) => api.post('/groups/member', payload);
export const updateGroup = (groupId, payload) => api.patch(`/groups/${groupId}`, payload);
export const deleteGroup = (groupId) => api.delete(`/groups/${groupId}`);
export const removeGroupMember = (groupId, memberId) => api.delete(`/groups/${groupId}/member/${memberId}`);
export const fetchGroupById = (groupId) => api.get(`/groups/${groupId}`);
