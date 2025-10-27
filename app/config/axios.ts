
import { BaseQueryFn, FetchBaseQueryArgs } from '@reduxjs/toolkit/query';
import axios, { AxiosRequestConfig } from 'axios';

import config from '@/app/config/app';

const configuredAxios = axios.create({
  baseURL: config.apiUrl,
  headers: {
    // 'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

configuredAxios.defaults.baseURL = `${config.apiUrl}`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const baseQueryBase = (_args: FetchBaseQueryArgs):
BaseQueryFn<AxiosRequestConfig, unknown, unknown> => async (req, { getState, dispatch }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const state = getState() as any;
  const { accessToken } = state.User;

  if (accessToken) {
    req.headers = {
      ...(req.headers || {}),
      Authorization: `Bearer ${accessToken}`,
    };
  }

  if (req.data instanceof FormData) {
    req.headers = { ...(req.headers || {}) };
    delete req.headers['Content-Type'];
  }

  try {
    const { data } = await configuredAxios(req);
    return { data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const { response } = error;

      if (response?.status === 401
        // If not the login url, redirect to initial screen
        && (!response?.config?.url?.endsWith('/login'))) {
        dispatch({ type: 'User/clearUserToken' });
      }
    }
    return {
      error: {
        status: error?.response?.status,
        response: error?.response,
      },
    };
  }
};

const BaseQuery = baseQueryBase({});

export { BaseQuery };

export default configuredAxios;
