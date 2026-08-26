import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const API_URL = '/api/v1';
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
    'CompetitionSeason',
    // GameEngine
    'Game',
    'GameInstance',
    'GamePrize',
    'GameEntry',
    'GameResult',
    // Games List
    'GuessThePlayer',
    'BingoGame',
    'CareerGame',
    'Top10',
    'GridGame'

  ],
  endpoints: () => ({}),
});
