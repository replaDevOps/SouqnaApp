import axios from 'axios';
import {store} from '../redux/store';
import {isTokenExpired} from './helper';
import {refreshAuthToken} from './authProvider';

const api = axios.create({
  baseURL: 'https://souqna-backend.healthflowpro.com/api', // Replace with actual API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔄 Intercept requests to check and refresh token if expired
api.interceptors.request.use(
  async config => {
    let state = store.getState();
    let token = state.user.token;
    let refreshToken = state.user.refreshToken;

    if (token && isTokenExpired(token)) {
      console.log('⚠️ Token expired. Attempting refresh...');
      token = await refreshAuthToken(store.dispatch, refreshToken);
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token to request
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default api;
