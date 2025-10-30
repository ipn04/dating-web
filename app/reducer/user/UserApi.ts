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
      { minAge?: number; maxAge?: number; distance?: number }
    >({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters.minAge) params.append('minAge', filters.minAge.toString());
        if (filters.maxAge) params.append('maxAge', filters.maxAge.toString());
        if (filters.distance) params.append('distance', filters.distance.toString());

        return {
          url: `/auth/allUser?${params.toString()}`,
          method: 'GET',
        };
      },
    }),

    updateUser: builder.mutation<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any,
      { data: FormData }
    >({
      query: ({ data }) => ({
        url: '/auth/update',
        method: 'PUT',
        data,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useSignUpMutation,
  useLazyGetUserQuery,
  useLazyGetAllUserQuery,
  useUpdateUserMutation,
} = UserApi;

export default UserApi;