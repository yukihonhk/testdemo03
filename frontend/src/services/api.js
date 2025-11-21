import axios from 'axios';
import { apiConfig } from '../config/authConfig';

const api = axios.create({
  baseURL: apiConfig.baseUrl,
});

// Add auth token to requests
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Timesheet API calls
export const timesheetService = {
  getAll: (params) => api.get('/timesheets', { params }),
  getById: (id) => api.get(`/timesheets/${id}`),
  create: (data) => api.post('/timesheets', data),
  update: (id, data) => api.put(`/timesheets/${id}`, data),
  delete: (id) => api.delete(`/timesheets/${id}`),
  getSummary: (params) => api.get('/timesheets/stats/summary', { params }),
};

// Job Types API calls
export const jobTypesService = {
  getAll: () => api.get('/jobtypes'),
  getById: (id) => api.get(`/jobtypes/${id}`),
  getByCategory: (category) => api.get(`/jobtypes/category/${category}`),
};

// Auth API calls
export const authService = {
  getLoginUrl: () => api.get('/auth/login'),
  callback: (code) => api.post('/auth/callback', { code }),
  logout: () => api.post('/auth/logout'),
};

export default api;
