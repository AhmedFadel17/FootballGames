import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


const API_URL = import.meta.env.VITE_APP_URL ?? "/";

const toUrlEncoded = (data: Record<string, any>) =>
    new URLSearchParams(data).toString();

export const identityApi = createApi({
    reducerPath: 'identityApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_URL,
    }),
    endpoints: (builder) => ({
        login: builder.mutation<any, { username: string; password: string }>({
            query: ({ username, password }) => ({
                url: '/api/auth/login',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    username,
                    password,
                }),
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

        register: builder.mutation<any, registerData>(
            {
                query: (data) => ({
                    url: '/api/auth/register',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json', 
                    },
                    body: {
                        email: data.email,
                        password: data.password,
                        username: data.username,
                        role: 0,
                    },
                }),
                
            }
        ),
    }),
});

export const {
    useLoginMutation,
    useRefreshTokenMutation,
    useRegisterMutation,
} = identityApi;
