import api from './axiosClient.js';

export const fetchExpenses = (params) => api.get('/expenses', { params });
export const fetchExpenseById = (id) => api.get(`/expenses/${id}`);
export const createExpense = (payload) => api.post('/expenses', payload);
export const updateExpense = (id, payload) => api.patch(`/expenses/${id}`, payload);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);
export const fetchDashboardOverview = () => api.get('/analytics/overview');
export const fetchAnalyticsSummary = () => api.get('/analytics/summary');
