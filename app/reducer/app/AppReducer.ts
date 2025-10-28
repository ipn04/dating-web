import { createSlice } from '@reduxjs/toolkit';
import AppApi from './AppApi';

export interface AppState {
  likedUserIds: string[];
  dislikedUserIds: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matches: any[];
}

const defaultState: AppState = {
  likedUserIds: [],
  dislikedUserIds: [],
  matches: [],
};

const reducer = createSlice({
  name: 'App',
  initialState: defaultState,

  reducers: {
    clearUserToken: () => defaultState,

    addLikedUser: (state, action) => {
      if (!state.likedUserIds.includes(action.payload)) {
        state.likedUserIds.push(action.payload);
      }
    },

    addDislikedUser: (state, action) => {
      if (!state.dislikedUserIds.includes(action.payload)) {
        state.dislikedUserIds.push(action.payload);
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addMatcher(AppApi.endpoints.likeUser.matchFulfilled, (state, action) => {
        const userId = action.meta.arg.originalArgs;
        if (!state.likedUserIds.includes(userId)) {
          state.likedUserIds.push(userId);
        }
      })
      .addMatcher(AppApi.endpoints.dislikeUser.matchFulfilled, (state, action) => {
        const userId = action.meta.arg.originalArgs;
        if (!state.dislikedUserIds.includes(userId)) {
          state.dislikedUserIds.push(userId);
        }
      })
      .addMatcher(AppApi.endpoints.getMatch.matchFulfilled, (state, action) => {
        state.matches = action.payload;
      });
  },
});

export const {
  clearUserToken,
  addLikedUser,
  addDislikedUser,
} = reducer.actions;

export default reducer;
