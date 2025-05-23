import axios from 'axios';

const API = axios.create({
  baseURL: 'https://backend.souqna.net/api/',
  timeout: 10000,
  withCredentials: true,
});
export const BASE_URL = 'https://backend.souqna.net/';
export const BASE_URL_Product = 'https://backend.souqna.net';

// api/uploadProductImages.js

export const uploadProductImages = async (productId, imageFiles, token) => {
  const formData = new FormData();

  formData.append('id', productId);

  imageFiles.forEach((image, index) => {
    formData.append('images[]', {
      uri: image.uri,
      name: image.name || `image_${index}.jpg`,
      type: image.type || 'image/jpeg',
    });
  });
  console.log(
    'Uploading images:',
    imageFiles.map(img => ({
      uri: img.uri,
      name: img.name,
      type: img.type,
    })),
  );

  try {
    const response = await API.post(`uploadProductImage`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Upload error:', error.response?.data || error.message);
    return {success: false, message: error.message};
  }
};

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

export const switchUserRole = async (token, currentRole, sellerType = null) => {
  try {
    // Determine which endpoint to use based on current role
    let endpoint = '';
    let requestData = {};

    if (currentRole === '2' || currentRole === 2) {
      // Switching from seller to buyer
      endpoint = 'switchToBuyer';
      requestData = {
        role: 4, // As specified in requirements
      };
    } else if (currentRole === '3' || currentRole === 3) {
      // Switching from buyer to seller
      endpoint = 'switchToSeller';
      requestData = {
        role: 4, // As specified in requirements
        sellerType: sellerType,
      };
    } else {
      return {
        success: false,
        error: 'Invalid current role',
      };
    }

    // Make the API call
    const response = await API.post(endpoint, requestData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(`Switch role response (${endpoint}):`, response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error switching user role:',
      error?.response?.data || error.message,
    );

    // Return error information in a structured format
    return {
      success: false,
      error: error?.response?.data?.message || error.message,
      status: error?.response?.status,
    };
  }
};

export const fetchSellerProducts = async (token, filters = {}) => {
  try {
    const response = await API.post('showAllProducts', filters, {
      headers: {
        Authorization: `Bearer ${token}`,
        pageNo: 1,
        recordsPerPage: 20,
      },
    });
    console.log('Endpoint Used: showAllProducts (Seller)');

    if (response.status === 200) return response.data;
    console.error(`Error: Received status code ${response.status}`);
    return null;
  } catch (error) {
    console.error(
      'Error fetching seller products:',
      error.response?.data || error.message,
    );
    return null;
  }
};

export const fetchBuyerProducts = async (filters = {}) => {
  try {
    const response = await API.post('showProducts', filters, {
      headers: {
        pageNo: 1,
        recordsPerPage: 20,
      },
    });
    console.log('Endpoint Used: showProducts (Buyer/Guest)');

    if (response.status === 200) return response.data;
    console.error(`Error: Received status code ${response.status}`);
    return null;
  } catch (error) {
    console.error(
      'Error fetching buyer/guest products:',
      error.response?.data || error.message,
    );
    return null;
  }
};

export const addToCart = async (productId, qty = 1) => {
  try {
    const response = await API.post(
      'addToCart',
      {
        productID: productId,
        qty: qty,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    console.log('Sending productID:', productId);
    console.log('AddToCart response:', response.status, response.data);

    return response.data;
  } catch (error) {
    console.error(
      'Error adding to cart:',
      error?.response?.data || error.message,
    );
    return null;
  }
};

export const fetchCartItems = async (pageNo = 1, recordsPerPage = 10) => {
  try {
    const response = await API.post('showCartItems', null, {
      headers: {
        pageNo: pageNo,
        recordsPerPage: recordsPerPage,
      },
    });

    console.log('Cart items from API:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error fetching cart items:',
      error?.response?.data || error.message,
    );
    return null;
  }
};

export const deleteCartItem = async cartId => {
  try {
    const response = await API.delete(`deleteCartItem/${cartId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error deleting cart item (${cartId}):`,
      error?.response?.data || error.message,
    );
    return null;
  }
};

export const getProduct = async (
  productId,
  token,
  role,
  verificationStatus,
) => {
  try {
    const endpoint =
      role === 2 && verificationStatus === 2
        ? `getProduct/${productId}`
        : `productDetails/${productId}`;

    const headers = token ? {Authorization: `Bearer ${token}`} : {};

    const response = await API.get(endpoint, {headers});
    return response.data;
  } catch (error) {
    console.error(
      'Error fetching single product:',
      error?.response?.data || error.message,
    );
    return null;
  }
};

export const updateCartItem = async (cartItemId, qty, productID) => {
  try {
    console.log('Updating cart item with body:', {
      id: cartItemId,
      qty,
      productID,
    });

    const response = await API.post('updateCartItem', {
      id: cartItemId,
      qty,
      productID,
    });

    console.log('Updated Cart : ', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error updating cart item:',
      error?.response?.data || error.message,
    );
    return null;
  }
};

export const fetchProductsBySubCategory = async subCategoryId => {
  try {
    const response = await API.get(`getProductBySubCategory/${subCategoryId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching products for subCategoryId ${subCategoryId}:`,
      error?.response?.data || error.message,
    );
    return null;
  }
};

export const placeOrder = async (orderData, token) => {
  try {
    const response = await API.post('placeOrder', orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      'Error placing order:',
      error?.response?.data || error.message,
    );
    return null;
  }
};

const sendPushNotification = async (title, body, receiverToken) => {
  try {
    const res = await axios.post(
      'https://your-backend.com/api/send-notification',
      {
        title,
        body,
        token: receiverToken, // or userId, depending on backend design
      },
    );

    if (res.data.success) {
      console.log('Notification sent!');
    } else {
      console.warn('Notification failed:', res.data.message);
    }
  } catch (err) {
    console.error('Error sending push notification:', err);
  }
};

export const fetchNotifications = async (token, role) => {
  try {
    let endpoint = null;
    let response = null;

    if (role === 2) {
      endpoint = 'viewAllNotificaionsSeller';
      response = await API.get(
        endpoint,
        {amount: 200},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
    } else if (role === 3) {
      endpoint = 'viewAllNotificaionsBuyer';
      response = await API.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      console.warn('Unsupported role for notifications:', role);
      return null;
    }

    return response.data;
  } catch (error) {
    console.error(
      'Error fetching notifications:',
      error?.response?.data || error.message,
    );
    return null;
  }
};

export const submitCardDetails = async (cardData, token) => {
  try {
    const response = await API.post('subscription', cardData, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && {Authorization: `Bearer ${token}`}),
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      'Error submitting card details:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const verifyOtp = async otp => {
  try {
    const response = await API.post('verifyOtp', {
      // phone: phoneNumber,
      otp: otp,
    });
    return response.data;
  } catch (error) {
    console.error(
      'Error verifying OTP:',
      error.response?.data || error.message,
    );
    return {
      success: false,
      error: error?.response?.data?.message || error.message,
    };
  }
};

export const resendOtp = async email => {
  try {
    const response = await API.post(
      'resendOtp',
      {email},
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      'Error resending OTP:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const deleteProduct = async (productId, token) => {
  try {
    const response = await API.delete(`deleteProductSeller/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error.response?.data || error);
    throw error;
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
