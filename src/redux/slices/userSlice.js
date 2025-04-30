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
  role: '',
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
      role: '',
    }),
    setVerificationStatus: (state, action) => {
      state.verificationStatus = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
  },
});

export const {setUser, logoutUser, setVerificationStatus, setRole} =
  userSlice.actions;

export default userSlice.reducer;
