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
  actualRole: '', // Add actualRole to initialState
  password: '',
  sellerType: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Action to set the user token and user data
    setUser: (state, action) => {
      const userData = action.payload;
      // Update all user properties
      Object.assign(state, userData);
      // Ensure actualRole is set when user data is loaded
      state.actualRole = userData.role || userData.actualRole || '';
    },
    logoutUser: () => ({
      token: null,
      refreshToken: null,
      tokenExpire: null,
      id: null,
      name: '',
      email: '',
      role: '',
      actualRole: '',
      password: '',
    }),
    setVerificationStatus: (state, action) => {
      state.verificationStatus = action.payload;
    },
    setRole: (state, action) => {
      // Only update the displayed/active role
      state.role = action.payload;
    },
    setActualRole: (state, action) => {
      // Update the server-side role
      state.actualRole = action.payload;
      // Also update active role if needed
      if (!action.payload.keepActiveRole) {
        state.role = action.payload;
      }
    },
  },
});

export const {
  setUser,
  logoutUser,
  setVerificationStatus,
  setRole,
  setActualRole,
} = userSlice.actions;

export default userSlice.reducer;
