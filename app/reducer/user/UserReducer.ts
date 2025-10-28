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
  allUser:
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any;
}

const defaultState: UserState = {
  accessToken: null,
  user: {},
  userProfile: {},
  allUser: [],
};

const reducer = createSlice({
  name: 'User',
  initialState: defaultState,

  // Non API request reducers
  reducers: {
    clearUserToken: () => defaultState,
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
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

    builder.addMatcher(UserApi.endpoints.getUser.matchFulfilled, (state, { payload }) => {
      state.userProfile = payload;
    });

    builder.addMatcher(UserApi.endpoints.getAllUser.matchFulfilled, (state, { payload }) => {
      state.allUser = payload;
    });

    builder.addMatcher(UserApi.endpoints.logout.matchFulfilled, () => defaultState);
  },
});

const UserAction = reducer.actions;

export const {
  clearUserToken,
  setUserProfile,
} = UserAction;

export default reducer;
