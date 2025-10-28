import { createApi } from '@reduxjs/toolkit/query/react';

import { BaseQuery } from '@/app/config/axios';

const UserApi = createApi({
  reducerPath: 'UserApi',
  baseQuery: BaseQuery,
  tagTypes: [ 'User' as const ],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: data => ({
        url: '/auth/login',
        method: 'POST',
        data: {
          ...data,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),

    logout: builder.mutation<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any,
      void
    >({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),

    signUp: builder.mutation<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any,
      FormData
    >({
      query: (newData) => ({
        url: '/auth/signup',
        method: 'POST',
        data: newData,
      }),
    }),

    getUser: builder.query<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any,
      void
    >({
      query: () => ({
        url: '/auth/me',
      }),
    }),

    getAllUser: builder.query<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any,
      void
    >({
      query: () => ({
        url: '/auth/allUser',
      }),
    }),

  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useSignUpMutation,
  useLazyGetUserQuery,
  useLazyGetAllUserQuery,
} = UserApi;

export default UserApi;