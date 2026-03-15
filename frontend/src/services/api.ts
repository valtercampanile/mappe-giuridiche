import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingRequests: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processPending(token: string | null) {
  for (const req of pendingRequests) {
    if (token) req.resolve(token);
    else req.reject(new Error('Refresh failed'));
  }
  pendingRequests = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingRequests.push({
          resolve: (token: string) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const newToken = await useAuthStore.getState().refreshSession();
      isRefreshing = false;

      if (newToken) {
        processPending(newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      }

      processPending(null);
      window.location.href = '/login';
      return Promise.reject(error);
    } catch (refreshError) {
      isRefreshing = false;
      processPending(null);
      await useAuthStore.getState().logout();
      window.location.href = '/login';
      return Promise.reject(refreshError);
    }
  },
);

export default api;
