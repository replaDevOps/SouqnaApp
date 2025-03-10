import {setUser} from '../redux/slices/userSlice';
import api from './apiServices';

export const refreshAuthToken = async (refreshToken, dispatch) => {
  try {
    const response = await api.post('/refreshToken', {refreshToken});

    if (response.data.status) {
      const newToken = response.data.token;
      const newRefreshToken = response.data.refreshToken;

      dispatch(
        setUser({
          token: newToken,
          refreshToken: newRefreshToken,
        }),
      );

      return newToken;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};
