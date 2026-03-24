// Shared API utility for the Clubs feature
import axios from 'axios';

const BASE = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('clubsToken');

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
  submit: (data) => axios.post(`${BASE}/applications`, data, authHeaders()),
  getMy: () => axios.get(`${BASE}/applications/my`, authHeaders()),
};

export const recommendationsAPI = {
  get: (data) => axios.post(`${BASE}/recommendations`, data, authHeaders()),
  getChat: (message) => axios.post(`${BASE}/recommendations/chat`, { message }, authHeaders()),
};

export const adminAPI = {
  getStats: () => axios.get(`${BASE}/admin/stats`, authHeaders()),
  // Clubs
  getClubs: () => axios.get(`${BASE}/admin/clubs`, authHeaders()),
  createClub: (data) => axios.post(`${BASE}/admin/clubs`, data, authHeaders()),
  updateClub: (id, data) => axios.put(`${BASE}/admin/clubs/${id}`, data, authHeaders()),
  deleteClub: (id) => axios.delete(`${BASE}/admin/clubs/${id}`, authHeaders()),
  // Applications
  getApplications: (params) => axios.get(`${BASE}/admin/applications`, { ...authHeaders(), params }),
  updateApplication: (id, data) => axios.put(`${BASE}/admin/applications/${id}`, data, authHeaders()),
  // Members
  getMembers: (clubId) => axios.get(`${BASE}/admin/clubs/${clubId}/members`, authHeaders()),
  removeMember: (appId) => axios.delete(`${BASE}/admin/applications/${appId}/remove-member`, authHeaders()),
};

export const setSession = (token, user) => {
  localStorage.setItem('clubsToken', token);
  localStorage.setItem('clubsUser', JSON.stringify(user));
};

export const getSession = () => {
  const token = localStorage.getItem('clubsToken');
  const user = localStorage.getItem('clubsUser');
  return token && user ? { token, user: JSON.parse(user) } : null;
};

export const clearSession = () => {
  localStorage.removeItem('clubsToken');
  localStorage.removeItem('clubsUser');
};
