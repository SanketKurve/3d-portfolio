import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Public API calls
export const fetchProjects = () => api.get('/projects');
export const fetchSkills = () => api.get('/skills');
export const fetchCertificates = () => api.get('/certificates');
export const submitContact = (data) => api.post('/contact', data);

// Admin Auth
export const adminLogin = (credentials) => api.post('/admin/auth/login', credentials);
export const verifyAdmin = () => api.get('/admin/auth/verify');

// Admin Projects
export const adminGetProjects = () => api.get('/admin/projects');
export const adminCreateProject = (data) => api.post('/admin/projects', data);
export const adminUpdateProject = (id, data) => api.put(`/admin/projects/${id}`, data);
export const adminDeleteProject = (id) => api.delete(`/admin/projects/${id}`);

// Admin Skills
export const adminGetSkills = () => api.get('/admin/skills');
export const adminCreateSkill = (data) => api.post('/admin/skills', data);
export const adminUpdateSkill = (id, data) => api.put(`/admin/skills/${id}`, data);
export const adminDeleteSkill = (id) => api.delete(`/admin/skills/${id}`);

// Admin Certificates
export const adminGetCertificates = () => api.get('/admin/certificates');
export const adminCreateCertificate = (data) => api.post('/admin/certificates', data);
export const adminUpdateCertificate = (id, data) => api.put(`/admin/certificates/${id}`, data);
export const adminDeleteCertificate = (id) => api.delete(`/admin/certificates/${id}`);

// Admin Messages
export const adminGetMessages = () => api.get('/admin/messages');
export const adminUpdateMessageStatus = (id, status) => api.put(`/admin/messages/${id}/status?status=${status}`);
export const adminDeleteMessage = (id) => api.delete(`/admin/messages/${id}`);

// Admin Dashboard
export const getDashboardStats = () => api.get('/admin/dashboard/stats');

export default api;
