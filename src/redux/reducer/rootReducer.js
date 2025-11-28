import {combineReducers} from 'redux';
import userReducer from '../slices/userSlice';
import favoritesReducer from '../slices/favoritesSlice';
import snackbarReducer from '../slices/snackbarSlice';

const rootReducer = combineReducers({
  user: userReducer,
  favorites: favoritesReducer,
  snackbar: snackbarReducer,
});

export default rootReducer;
