import storage from 'redux-persist/lib/storage';

export default {
  app: {
    key: 'App',
    storage,
    whitelist: [ 'theme', 'matches', 'users' ],
  },
  user: {
    key: 'User',
    storage,
    whitelist: [ 'accessToken', 'user' ],
  },
};
