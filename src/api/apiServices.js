import axios from 'axios';

const API = axios.create({
  baseURL: 'https://souqna-backend.healthflowpro.com/',
  timeout: 10000, // Optional: Set timeout
  headers: {
    'Content-Type': 'application/json',
  },
});


API.interceptors.request.use(
  async (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
