import axios from 'axios';
import {store} from '../redux/store';
import {isTokenExpired} from './helper';
import {refreshAuthToken} from './authProvider';
import {setUser, logoutUser} from '../redux/slices/userSlice';

const api = axios.create({
  baseURL: 'https://souqna-backend.healthflowpro.com/api', // Replace with actual API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

let refreshPromise = null;
// 🔄 Intercept requests to check and refresh token if expired
api.interceptors.request.use(
  async config => {
    if (config.url.includes('/login')) {
      return config;
    }

    let state = store.getState();
    let token = state.user.token;
    let refreshToken = state.user.refreshToken;

    if (!token || isTokenExpired(token)) {
      console.log('⚠️ Token expired. Attempting refresh...');
      // Prevent multiple refresh attempts
      if (!refreshToken) {
        console.error('⛔ No refresh token available, logging out user');
        store.dispatch(logoutUser());
        return Promise.reject({message: 'Unauthorized'});
      }
      token = await refreshAuthToken(store.dispatch, refreshToken);

      // If there's already a refresh call in progress, wait for it
      if (!refreshPromise) {
        refreshPromise = refreshAuthToken(store.dispatch, refreshToken).finally(
          () => {
            refreshPromise = null;
          },
        );
      }
      token = await refreshPromise;

      if (!token) {
        console.error('⛔ No valid token, rejecting request');
        return Promise.reject({message: 'Unauthorized'}); // Reject request
      }
    }

    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error),
);

export default api;
