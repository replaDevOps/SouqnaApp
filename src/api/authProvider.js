import {setUser, logoutUser} from '../redux/slices/userSlice';
import api from '../api/apiServices';

export const refreshAuthToken = async (dispatch, refreshToken) => {
  try {
    const response = await api.post('/refresh-token', {refreshToken});
    if (response.data.status) {
      const newToken = response.data.token;

      dispatch(
        setUser({
          token: newToken,
          refreshToken: response.data.refreshToken, // Update refresh token if provided
          email: response.data.user.email,
          id: response.data.user.id,
          profileName: response.data.user.name,
        }),
      );

      console.log('🔄 Token refreshed:', newToken);
      return newToken;
    } else {
      console.error('❌ Refresh token failed:', response.data.message);
      dispatch(logoutUser()); // If refresh fails, log out user
      return null;
    }
  } catch (error) {
    console.error('❌ Error refreshing token:', error);
    dispatch(logoutUser()); // Log out on failure
    return null;
  }
};
