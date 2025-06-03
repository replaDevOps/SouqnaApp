// src/redux/slices/snackbarSlice.js
import {createSlice} from '@reduxjs/toolkit';

const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState: {
    visible: false,
    message: '',
  },
  reducers: {
    showSnackbar: (state, action) => {
      state.visible = true;
      state.message = action.payload;
    },
    hideSnackbar: state => {
      state.visible = false;
      state.message = '';
    },
  },
});

export const {showSnackbar, hideSnackbar} = snackbarSlice.actions;
export default snackbarSlice.reducer;
