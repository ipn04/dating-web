import { createApi } from '@reduxjs/toolkit/query/react';

import { BaseQuery } from '@/app/config/axios';

const AppApi = createApi({
  reducerPath: 'AppApi',
  baseQuery: BaseQuery,
  tagTypes: [ 'App' as const, 'Message' as const ],
  endpoints: (builder) => ({
    likeUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/client/like/${userId}`,
        method: 'POST',
      }),
    }),

    dislikeUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/client/dislike/${userId}`,
        method: 'POST',
      }),
    }),

    getMatch: builder.query<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any,
      void
    >({
      query: () => ({
        url: '/client/match',
      }),
    }),

    sendMessage: builder.mutation<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any,
      { receiverId: string; content: string }
    >({
      query: ({ receiverId, content }) => ({
        url: `/client/messages/send/${receiverId}`,
        method: 'POST',
        data: { content },
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Message'],
    }),

    getMessages: builder.query<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any[],
      string
    >({
      query: (matchId) => ({
        url: `/client/messages/match/${matchId}`,
        method: 'GET',
      }),
      providesTags: ['Message'],
    }),

    removeMatch: builder.mutation<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any,
      string
    >({
      query: (userId) => ({
        url: `/client/unmatch/${userId}`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useLikeUserMutation,
  useDislikeUserMutation,
  useLazyGetMatchQuery,
  useSendMessageMutation,
  useLazyGetMessagesQuery,
  useRemoveMatchMutation,
} = AppApi;

export default AppApi;