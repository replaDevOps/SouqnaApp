// favoritesSlice.js

import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  favorites: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action) => {
      // Check if the product is already in the favorites
      const existingProductIndex = state.favorites.findIndex(
        fav => fav.id === action.payload.id,
      );
      if (existingProductIndex === -1) {
        // If the product is not in favorites, add it
        state.favorites.push(action.payload);
      }
    },
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter(
        fav => fav.id !== action.payload.id,
      );
    },
  },
});

export const {addFavorite, removeFavorite} = favoritesSlice.actions;
export default favoritesSlice.reducer;
