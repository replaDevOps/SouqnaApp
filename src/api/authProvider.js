import {setUser, logoutUser} from '../redux/slices/userSlice';
import api from '../api/apiServices';

export const refreshAuthToken = async (dispatch, refreshToken) => {
  console.log('Refresh Token: ', refreshToken);
  try {
    const response = await api.post('/refreshToken', {refreshToken});
    if (response.data.status && response.data.access_token) {
      console.log('New Token: ', response.data.access_token);
      const newToken = response.data.access_token;

      dispatch(
        setUser({
          token: newToken,
          refreshToken: response.data.refreshToken,
          email: response.data.user.email,
          id: response.data.user.id,
          profileName: response.data.user.name,
        }),
      );

      console.log('🔄 Token refreshed:', newToken);
      return newToken;
    } else {
      console.warn('⚠️ Refresh failed:', response.data.message);
      dispatch(logoutUser()); // 🔴 Log out user if refresh fails
      return null;
    }
  } catch (error) {
    console.error(
      '❌ Error refreshing token:',
      error.response?.data || error.message,
      dispatch(logoutUser()),
    );

    // Only log out if it's a 401 Unauthorized error
    if (error.response?.status === 401) {
      dispatch(logoutUser());
    }

    return null;
  }
};
