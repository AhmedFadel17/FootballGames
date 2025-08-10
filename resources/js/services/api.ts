import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from './customBaseQuery';

type GetArgs = {
  url: string;
  params?: Record<string, any>;
};

type MutationWithIdArgs<T = any> = {
  url: string;
  id: number | string;
  body?: T;
};


export const api = createApi({
  reducerPath: 'api',
  baseQuery: customBaseQuery,
  tagTypes: ["BingoGame", "BingoConditions","BingoCondition", "BingoMatch"],
  endpoints: (builder) => ({
    getData: builder.query<any, GetArgs>({
      query: ({ url = "", params = "" }) => {
        const queryString = params
          ? '?' + new URLSearchParams(params as any).toString()
          : '';
        return `${url}${queryString}`;
      },
    }),

    deleteById: builder.mutation<any, Omit<MutationWithIdArgs, 'body'>>({
      query: ({ url, id }) => ({
        url: `${url}/${id}`,
        method: 'DELETE',
      }),
    }),

    updateById: builder.mutation<any, MutationWithIdArgs>({
      query: ({ url, id, body }) => ({
        url: `${url}/${id}`,
        method: 'PUT',
        body,
      }),
    }),

    createData: builder.mutation<any, { url: string; body: any }>({
      query: ({ url, body }) => ({
        url,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGetDataQuery,
  useDeleteByIdMutation,
  useUpdateByIdMutation,
  useCreateDataMutation,
} = api;
