import axios from 'axios';

const API = axios.create({
  baseURL: 'https://backend.souqna.net/api/',
  timeout: 10000,
});
export const BASE_URL = 'https://backend.souqna.net/';
export const BASE_URL_Product = 'https://backend.souqna.net';

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

export const fetchProducts = async token => {
  try {
    const response = await API.get('showAllProducts', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
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
