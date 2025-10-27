import { createSlice } from '@reduxjs/toolkit';
import UserApi from './UserApi';

export interface UserState {
  accessToken: string | null;
  user:
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any;
  userProfile:
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any;
}

const defaultState: UserState = {
  accessToken: null,
  user: {},
  userProfile: {},
};

const reducer = createSlice({
  name: 'User',
  initialState: defaultState,

  // Non API request reducers
  reducers: {
    clearUserToken: () => defaultState,
  },

  // API request reducers
  extraReducers: (builder) => {
    builder.addMatcher(UserApi.endpoints.login.matchFulfilled, (state, { payload }) => {
      const { access_token: accessToken, user } = payload;
      state.accessToken = accessToken;
      state.user = user;
    });

    builder.addMatcher(UserApi.endpoints.signUp.matchFulfilled, (state, { payload }) => {
      const { access_token: accessToken, user } = payload;
      state.accessToken = accessToken;
      state.user = user;
    });

    builder.addMatcher(UserApi.endpoints.logout.matchFulfilled, () => defaultState);
  },
});

const UserAction = reducer.actions;

export const {
  clearUserToken,
} = UserAction;

export default reducer;
