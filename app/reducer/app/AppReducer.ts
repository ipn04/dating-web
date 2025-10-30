import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AppApi from './AppApi';

export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  matchId: string;
  isRead: boolean;
  createdAt: string;
}

export interface AppState {
  likedUserIds: string[];
  dislikedUserIds: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matches: any[];
  messages: Record<string, Message[]>;
}

const defaultState: AppState = {
  likedUserIds: [],
  dislikedUserIds: [],
  matches: [],
  messages: {},
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

    clearMessages: (state) => { state.messages = {}; },
    addLocalMessage: (state, action: PayloadAction<{ matchId: string; message: Message }>) => {
      const { matchId, message } = action.payload;
      if (!state.messages[matchId]) state.messages[matchId] = [];
      state.messages[matchId].push(message);
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
      })
      .addMatcher(AppApi.endpoints.getMessages.matchFulfilled, (state, action) => {
        const matchId = action.meta.arg.originalArgs;
        state.messages[matchId] = action.payload;
      })

      .addMatcher(AppApi.endpoints.sendMessage.matchFulfilled, (state, action) => {
        const message: Message = action.payload;
        const matchId = message.matchId;
        if (!state.messages[matchId]) state.messages[matchId] = [];
        state.messages[matchId].push(message);
      })
      .addMatcher(AppApi.endpoints.removeMatch.matchFulfilled, (state, action) => {
        const removedUserId = action.meta.arg.originalArgs;
        state.matches = state.matches.filter((match) => match.id !== removedUserId);
        Object.keys(state.messages).forEach((matchId) => {
          const hasUser = state.messages[matchId].some(
            (msg) => msg.senderId === removedUserId || msg.receiverId === removedUserId,
          );
          if (hasUser) {
            delete state.messages[matchId];
          }
        });
      });

  },
});

export const {
  clearUserToken,
  addLikedUser,
  addDislikedUser,
  clearMessages,
  addLocalMessage,
} = reducer.actions;

export default reducer;
