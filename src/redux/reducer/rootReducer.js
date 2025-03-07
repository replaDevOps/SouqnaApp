import {combineReducers} from 'redux';
import userReducer from '../slices/userSlice';
import favoritesReducer from '../slices/favoritesSlice';

const rootReducer = combineReducers({
  user: userReducer,
  favorites: favoritesReducer,
});

export default rootReducer;
