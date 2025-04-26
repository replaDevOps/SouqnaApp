// redux/slices/userSlice.js
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  token: null,
  refreshToken: null,
  tokenExpire: null,
  id: null,
  name: '',
  email: '',
  verificationStatus: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Action to set the user token and user data
    setUser: (state, action) => {
      return {...state, ...action.payload};
    },
    logoutUser: () => ({
      token: null,
      refreshToken: null,
      tokenExpire: null,
      id: null,
      name: '',
      email: '',
    }),
    setVerificationStatus: (state, action) => {
      state.verificationStatus = action.payload;
    },
  },
});

export const {setUser, logoutUser, setVerificationStatus} = userSlice.actions;

export default userSlice.reducer;
