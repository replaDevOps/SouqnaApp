import axios from 'axios';

const API = axios.create({
  baseURL: 'https://backend.souqna.net/api/',
  timeout: 10000,
});

export const fetchCategories = async token => {
  try {
    const response = await API.get('viewCategories', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return null;
  }
};

API.interceptors.request.use(
  async config => {
    // Example: Get token from AsyncStorage if needed
    // const token = await AsyncStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  error => Promise.reject(error),
);

export default API;
