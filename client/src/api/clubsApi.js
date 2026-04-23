// Shared API utility for the Clubs feature
import axios from 'axios';

const BASE = 'http://localhost:5001/api';

const getToken = () => localStorage.getItem('token');

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

export const authAPI = {
  register: (data) => axios.post(`${BASE}/auth/register`, data),
  login: (data) => axios.post(`${BASE}/auth/login`, data),
  me: () => axios.get(`${BASE}/auth/me`, authHeaders()),
};

export const clubsAPI = {
  getAll: (category) => axios.get(`${BASE}/clubs${category ? `?category=${category}` : ''}`),
  getById: (id) => axios.get(`${BASE}/clubs/${id}`),
};

export const applicationsAPI = {
  submit: (data) => axios.post(`${BASE}/clubs/applications`, data, authHeaders()),
  getMy: () => axios.get(`${BASE}/clubs/applications/my`, authHeaders()),
};

export const recommendationsAPI = {
  get: (data) => axios.post(`${BASE}/clubs/recommendations`, data, authHeaders()),
  getChat: (message, userContext) => axios.post(`${BASE}/clubs/recommendations/chat`, { message, userContext }, authHeaders()),
  getDraft: (data) => axios.post(`${BASE}/clubs/recommendations/draft`, data, authHeaders()),
  getHistory: () => axios.get(`${BASE}/clubs/recommendations/history`, authHeaders()),
  getSummary: () => axios.get(`${BASE}/clubs/recommendations/summary`, authHeaders()),
  clearHistory: () => axios.delete(`${BASE}/clubs/recommendations/history/clear`, authHeaders()),
};

export const adminAPI = {
  getStats: () => axios.get(`${BASE}/clubs/admin/stats`, authHeaders()),
  // Clubs
  getClubs: () => axios.get(`${BASE}/clubs/admin/clubs`, authHeaders()),
  createClub: (data) => axios.post(`${BASE}/clubs/admin/clubs`, data, authHeaders()),
  updateClub: (id, data) => axios.put(`${BASE}/clubs/admin/clubs/${id}`, data, authHeaders()),
  deleteClub: (id) => axios.delete(`${BASE}/clubs/admin/clubs/${id}`, authHeaders()),
  // Applications
  getApplications: (params) => axios.get(`${BASE}/clubs/admin/applications`, { ...authHeaders(), params }),
  updateApplication: (id, data) => axios.put(`${BASE}/clubs/admin/applications/${id}`, data, authHeaders()),
  // Members
  getMembers: (clubId) => axios.get(`${BASE}/clubs/admin/clubs/${clubId}/members`, authHeaders()),
  removeMember: (appId) => axios.delete(`${BASE}/clubs/admin/applications/${appId}/remove-member`, authHeaders()),
};

export const setSession = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const getSession = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return token && user ? { token, user: JSON.parse(user) } : null;
};

export const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
