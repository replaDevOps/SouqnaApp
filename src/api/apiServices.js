import axios from 'axios';
import store from '../redux/store';
import {refreshAuthToken} from './authService';

const api = axios.create({
  baseURL: 'https://souqna-backend.healthflowpro.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to refresh token if the request fails
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    const {token, refreshToken} = store.getState().user;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshAuthToken(refreshToken, store.dispatch);

      if (newToken) {
        api.defaults.headers['Authorization'] = `Bearer ${newToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
