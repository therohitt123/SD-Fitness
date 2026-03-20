import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token =
      localStorage.getItem('sd_fitness_auth_token') ||
      localStorage.getItem('sd_fitness_admin_token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error.response?.data?.message || error.message;
    console.error('API error:', message);

    const status = error.response?.status;
    const reqUrl = error.config?.url || '';
    const isAuthLoginCall = reqUrl.includes('/api/auth/admin/login');

    // If admin session is invalid/expired, clear stale token and move to login.
    if (status === 401 && !isAuthLoginCall && typeof window !== 'undefined') {
      localStorage.removeItem('sd_fitness_auth_token');
      localStorage.removeItem('sd_fitness_admin_token');
      localStorage.removeItem('sd_fitness_auth_role');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      } else if (window.location.pathname.startsWith('/trainer')) {
        window.location.href = '/trainer/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
