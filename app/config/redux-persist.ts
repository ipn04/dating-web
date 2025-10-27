import storage from 'redux-persist/lib/storage';

export default {
  app: {
    key: 'App',
    storage,
    whitelist: [ 'theme' ],
  },
  user: {
    key: 'User',
    storage,
    whitelist: [ 'accessToken', 'user' ],
  },
};
