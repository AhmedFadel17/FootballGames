import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { RootState, store } from '@/store';
import { logout, loginSuccess } from '@/store/slices/authSlice';
import { identityApi } from '@/services/identityApi';

const appUrl = import.meta.env.VITE_APP_URL ?? "/";

const baseQuery = fetchBaseQuery({
  baseUrl: appUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

export const customBaseQuery: BaseQueryFn = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    const refreshToken = (api.getState() as RootState).auth.refreshToken;
    if (!refreshToken) {
      api.dispatch(logout());
      return result;
    }

    try {
      const refreshResult = await store.dispatch(
        identityApi.endpoints.refreshToken.initiate({ refreshToken })
      );

      if ('data' in refreshResult && refreshResult.data.access_token) {
        const newAccessToken = refreshResult.data.access_token;
        const newRefreshToken = refreshResult.data.refresh_token;
        const expiresIn = refreshResult.data.expires_in;

        api.dispatch(loginSuccess({
          ...refreshResult.data
        }));

        result = await baseQuery(args, api, extraOptions); // Retry original request
      } else {
        api.dispatch(logout());
      }
    } catch {
      api.dispatch(logout());
    }
  }

  return result;
};
