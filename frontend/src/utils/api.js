import axios from 'axios';

const getLocalApiUrl = () => {
  const origin = window.location.origin;
  const match = origin.match(/:(\d+)/);
  if (match) {
    return origin.replace(match[0], ':5000') + '/api';
  }
  return origin.replace(/\/$/, '') + ':5000/api';
};

export const API_URL = process.env.REACT_APP_API_URL || getLocalApiUrl();
export const getBaseUrl = () => API_URL.replace('/api', '');

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
