import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LoginData,RegisterData } from '@/types/auth';

const API_URL = import.meta.env.VITE_APP_URL ?? "/";

const toUrlEncoded = (data: Record<string, any>) =>
    new URLSearchParams(data).toString();

export const identityApi = createApi({
    reducerPath: 'identityApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_URL,
    }),
    endpoints: (builder) => ({
        login: builder.mutation<any, LoginData>({
            query: (data) => ({
                url: '/api/auth/login',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(data),
            }),
        }),

        refreshToken: builder.mutation<any, { refreshToken: string }>({
            query: ({ refreshToken }) => ({
                url: '/api/auth/refresh',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    refresh_token: refreshToken,
                    grant_type: 'refresh_token',
                }),
            }),
        }),

        register: builder.mutation<any, RegisterData>(
            {
                query: (data) => ({
                    url: '/api/auth/register',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json', 
                    },
                    body: data
                    ,
                }),
                
            }
        ),

        guestLogin: builder.mutation<any, void>({
  query: () => ({
    url: '/api/auth/guest',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }),
}),

        
    }),
});

export const {
    useLoginMutation,
    useRefreshTokenMutation,
    useRegisterMutation,
    useGuestLoginMutation
} = identityApi;
