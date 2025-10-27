import { combineReducers } from 'redux';

import UserApi from './user/UserApi';
import UserReducer from './user/UserReducer';
import { persistReducer } from 'redux-persist';
import persistConfig from '@/app/config/redux-persist';

const reducers = combineReducers({
  // Reducers
  [UserReducer.name]: persistReducer(persistConfig.user, UserReducer.reducer),

  // API slices
  [UserApi.reducerPath]: UserApi.reducer,
});

export const apiMiddlewares = [
  UserApi.middleware,
];

export default reducers;
