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
        ...(token && {Authorization: `Bearer ${token}`}),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return null;
  }
};

export const fetchProducts = async (token, filters = {}, role) => {
  const isLoggedIn = !!token;

  try {
    const endpoint =
      isLoggedIn && role === 2 ? 'showAllProducts' : 'showProducts';

    const response = await API.post(endpoint, filters, {
      headers: {
        ...(isLoggedIn && {Authorization: `Bearer ${token}`}),
        pageNo: 1,
        recordsPerPage: 20,
      },
    });

    if (response.status === 200) {
      return response.data;
    }

    console.error(`Error: Received non-200 status code ${response.status}`);
    return null;
  } catch (error) {
    console.error(
      `Error fetching ${token ? 'authenticated' : 'unauthenticated'} products:`,
      error.response?.data || error.message,
    );
    return null;
  }
};

export const addToCart = async (productId, qty = 1) => {
  try {
    const response = await API.post('addToCart', {
      productID: productId,
      qty: qty,
    });

    return response.data;
  } catch (error) {
    console.error(
      'Error adding to cart:',
      error?.response?.data || error.message,
    );
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
