import { createApi } from '@reduxjs/toolkit/query/react';

import { BaseQuery } from '@/app/config/axios';

const AppApi = createApi({
  reducerPath: 'AppApi',
  baseQuery: BaseQuery,
  tagTypes: [ 'App' as const ],
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
  }),
});

export const {
  useLikeUserMutation,
  useDislikeUserMutation,
  useLazyGetMatchQuery,
} = AppApi;

export default AppApi;