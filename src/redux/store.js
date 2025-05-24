import {configureStore} from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistStore, persistReducer} from 'redux-persist';
import favoritesReducer from './slices/favoritesSlice';
import cartReducer from './slices/cartSlice';
import categoryReducer from './slices/categorySlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};
const favoritesPersistConfig = {
  key: 'favorites',  // ← Unique key for favorites data
  storage: AsyncStorage,
};
const cartPersistConfig = {
  key: 'cart',
  storage: AsyncStorage,
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);
const persistedFavoritesReducer = persistReducer(favoritesPersistConfig,favoritesReducer);
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);

const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    favorites: persistedFavoritesReducer,
    cart: persistedCartReducer,
    category: categoryReducer,
  },
});

const persistor = persistStore(store);

export {store, persistor};
