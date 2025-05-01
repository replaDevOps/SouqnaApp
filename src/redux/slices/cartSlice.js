import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      // Ensure image is properly formatted for React Native Image component
      const formattedPayload = {
        ...action.payload,
        // Handle case when image is an object
        image:
          typeof action.payload.image === 'string'
            ? action.payload.image
            : action.payload.image && action.payload.image.uri
            ? action.payload.image.uri
            : null,
      };

      const existingItem = state.items.find(
        item => item.id === formattedPayload.id,
      );

      if (existingItem) {
        existingItem.quantity += formattedPayload.quantity || 1;
      } else {
        state.items.push({
          ...formattedPayload,
          quantity: formattedPayload.quantity || 1,
        });
      }
    },

    updateQuantity: (state, action) => {
      const {id, change} = action.payload;
      const itemIndex = state.items.findIndex(item => item.id === id);

      if (itemIndex !== -1) {
        const item = state.items[itemIndex];
        const newQuantity = item.quantity + change;

        if (newQuantity <= 0) {
          // Remove item if quantity goes to 0 or below
          state.items.splice(itemIndex, 1);
        } else {
          item.quantity = newQuantity;
        }
      }
    },

    removeItem: (state, action) => {
      const {id} = action.payload;
      state.items = state.items.filter(item => item.id !== id);
    },

    clearCart: state => {
      state.items = [];
    },
  },
});

export const {addItem, removeItem, updateQuantity, clearCart} =
  cartSlice.actions;

export default cartSlice.reducer;
