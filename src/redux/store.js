import {configureStore} from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistStore, persistReducer} from 'redux-persist';
import favoritesReducer from './slices/favoritesSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};
const persistedUserReducer = persistReducer(persistConfig, userReducer);
const persistedFavoritesReducer = persistReducer(
  persistConfig,
  favoritesReducer,
);

const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    favorites: persistedFavoritesReducer,
  },
});

const persistor = persistStore(store);

export {store, persistor};
