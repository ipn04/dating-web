import { combineReducers } from 'redux';

import UserApi from './user/UserApi';
import AppApi from './app/AppApi';
import UserReducer from './user/UserReducer';
import { persistReducer } from 'redux-persist';
import persistConfig from '@/app/config/redux-persist';
import AppReducer from './app/AppReducer';

const reducers = combineReducers({
  // Reducers
  [UserReducer.name]: persistReducer(persistConfig.user, UserReducer.reducer),
  [AppReducer.name]: AppReducer.reducer,
  // API slices
  [UserApi.reducerPath]: UserApi.reducer,
  [AppApi.reducerPath]: AppApi.reducer,
});

export const apiMiddlewares = [
  UserApi.middleware,
  AppApi.middleware,
];

export default reducers;
