// redux/slices/userSlice.js
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  token: null, // Token for the logged-in user
  email: null,
  password: null,
  profileName: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Action to set the user token and user data
    setUser: (state, action) => {
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.password = action.payload.password;
      state.profileName = action.payload.profileName || null; // For private users
    },
    // Action to reset user data (if needed)
    resetUser: state => {
      state.token = null;
      state.email = null;
      state.password = null;
      state.profileName = null;
    },
  },
});

export const {setUser, resetUser} = userSlice.actions;

export default userSlice.reducer;
