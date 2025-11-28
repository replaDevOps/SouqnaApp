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
  phoneNo: '',

  tokens: {
    accessToken: null,
    refreshToken: null,
    accessTokenExpiry: null,
  },
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
    // Separate action for token management
    setTokens: (state, action) => {
      const {
        accessToken, // ✅ Consistent
        refreshToken, // ✅ Consistent
        accessTokenExpiry, // ✅ Consistent
      } = action.payload;

      state.tokens = {
        accessToken,
        refreshToken,
        accessTokenExpiry,
      };
    },

    // Action to update tokens after refresh
    updateTokens: (state, action) => {
      const {accessToken, refreshToken, accessTokenExpiry} = action.payload;

      if (accessToken) state.tokens.accessToken = accessToken;
      if (refreshToken) state.tokens.refreshToken = refreshToken;
      if (accessTokenExpiry) state.tokens.accessTokenExpiry = accessTokenExpiry;

      if (accessToken) state.token = accessToken;
    },

    // Clear tokens only
    clearTokens: state => {
      state.tokens = {
        accessToken: null,
        refreshToken: null,
        accessTokenExpiry: null,
      };
    },

    logoutUser: state => {
      // Clear everything
      return {
        id: null,
        name: '',
        email: '',
        role: '',
        actualRole: '',
        password: '',
        sellerType: '',
        verificationStatus: null,
        phoneNo: '',
        tokens: {
          accessToken: null,
          refreshToken: null,
          accessTokenExpiry: null,
        },
      };
    },

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
    resetUser: () => initialState,
  },
});

export const {
  setUser,
  setTokens,
  updateTokens,
  clearTokens,
  logoutUser,
  setVerificationStatus,
  setRole,
  setActualRole,
  resetUser,
} = userSlice.actions;

export default userSlice.reducer;
