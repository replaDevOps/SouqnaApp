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
    // Example: Get token from AsyncStorage if needed
    // const token = await AsyncStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
