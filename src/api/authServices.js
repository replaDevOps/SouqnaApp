import API from './apiServices'; // your configured axios instance

export const loginUser = async (email, password) => {
  try {
    const response = await API.post('login', {
      email,
      password,
    });

    console.log('Login response:', response);

    const data = response.data;

    if (data.success) {
      return {
        success: true,
        user: data.user,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Login failed',
      };
    }
  } catch (error) {
    console.error('Login API error:', error);

    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        'Something went wrong',
    };
  }
};
