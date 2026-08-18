import { mainApi } from './../../mainApi';
import { ApiResponse, PaginationResponse, PaginationFilter } from '@/types';
import { Continent } from '@/types';

export interface CreateContinentRequest {
    name: string;
    code: string;
}

export interface UpdateContinentRequest extends Partial<CreateContinentRequest> { }

export interface ContinentFilter extends PaginationFilter {
    searchQuery?: string;
}

export const continentsApi = mainApi.injectEndpoints({
    endpoints: (builder) => ({
        getContinents: builder.query<ApiResponse<PaginationResponse<Continent>>, ContinentFilter>({
            query: (filter) => {
                const params = new URLSearchParams();

                Object.entries(filter).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        params.append(key, value.toString());
                    }
                });

                return {
                    url: '/api/v1/admin/continents',
                    params: params,
                };
            },
            providesTags: (result) =>
                result?.data?.items
                    ? [
                        ...result.data.items.map(({ id }) => ({ type: 'Continent' as const, id })),
                        { type: 'Continent', id: 'LIST' },
                    ]
                    : [{ type: 'Continent', id: 'LIST' }],
        }),

        getContinentById: builder.query<ApiResponse<Continent>, number>({
            query: (id) => `/api/v1/admin/continents/${id}`,
            providesTags: (_result, _err, id) => [{ type: 'Continent', id }],
        }),

        createContinent: builder.mutation<ApiResponse<Continent>, CreateContinentRequest>({
            query: (body) => ({ url: '/api/v1/admin/continents', method: 'POST', body }),
            invalidatesTags: [{ type: 'Continent', id: 'LIST' }],
        }),

        updateContinent: builder.mutation<ApiResponse<Continent>, { id: number; body: UpdateContinentRequest }>({
            query: ({ id, body }) => ({ url: `/api/v1/admin/continents/${id}`, method: 'PUT', body }),
            invalidatesTags: (_result, _err, { id }) => [
                { type: 'Continent', id },
                { type: 'Continent', id: 'LIST' },
            ],
        }),

        deleteContinent: builder.mutation<ApiResponse<null>, number>({
            query: (id) => ({ url: `/api/v1/admin/continents/${id}`, method: 'DELETE' }),
            invalidatesTags: (_result, _err, id) => [
                { type: 'Continent', id },
                { type: 'Continent', id: 'LIST' },
            ],
        }),

    }),
});

export const {
    useGetContinentsQuery,
    useGetContinentByIdQuery,
    useCreateContinentMutation,
    useUpdateContinentMutation,
    useDeleteContinentMutation,
} = continentsApi;
