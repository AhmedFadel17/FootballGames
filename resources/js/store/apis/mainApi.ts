import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const mainApi = createApi({
  reducerPath: 'mainApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {

      headers.set('Accept', 'application/json');

      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    // Infra
    'User',
    'Admin',
    // Core
    'Season',
    'Country',
    'Continent',
    'Competition',
    'Team',
    'Player',
    'Manager',

  ],
  endpoints: () => ({}),
});
