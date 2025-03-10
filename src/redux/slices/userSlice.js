// redux/slices/userSlice.js
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  token: null,
  email: null,
  id: null,
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
      state.id = action.payload.id;
      state.profileName = action.payload.profileName || null;
    },
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
