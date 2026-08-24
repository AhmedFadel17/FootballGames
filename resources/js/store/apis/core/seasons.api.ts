import { mainApi, API_URL } from './../mainApi';
import { ApiResponse, PaginationResponse, PaginationFilter } from '@/types';
import { Season } from '@/types';

const BASE_URL = `${API_URL}/seasons`;
export interface CreateSeasonRequest {
    name: string;
    start_year: number;
    end_year: number;
}

export interface UpdateSeasonRequest extends Partial<CreateSeasonRequest> { }

export interface SeasonFilter extends PaginationFilter {
    searchQuery?: string;
}

export const seasonsApi = mainApi.injectEndpoints({
    endpoints: (builder) => ({
        getSeasons: builder.query<ApiResponse<PaginationResponse<Season>>, SeasonFilter>({
            query: (filter) => {
                const params = new URLSearchParams();

                Object.entries(filter).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        params.append(key, value.toString());
                    }
                });

                return {
                    url: BASE_URL,
                    params: params,
                };
            },
            providesTags: (result) =>
                result?.data?.items
                    ? [
                        ...result.data.items.map(({ id }) => ({ type: 'Season' as const, id })),
                        { type: 'Season', id: 'LIST' },
                    ]
                    : [{ type: 'Season', id: 'LIST' }],
        }),

        getSeasonById: builder.query<ApiResponse<Season>, number>({
            query: (id) => `${BASE_URL}/${id}`,
            providesTags: (_result, _err, id) => [{ type: 'Season', id }],
        }),

        createSeason: builder.mutation<ApiResponse<Season>, CreateSeasonRequest>({
            query: (body) => ({ url: BASE_URL, method: 'POST', body }),
            invalidatesTags: [{ type: 'Season', id: 'LIST' }],
        }),

        updateSeason: builder.mutation<ApiResponse<Season>, { id: number; body: UpdateSeasonRequest }>({
            query: ({ id, body }) => ({ url: `${BASE_URL}/${id}`, method: 'PUT', body }),
            invalidatesTags: (_result, _err, { id }) => [
                { type: 'Season', id },
                { type: 'Season', id: 'LIST' },
            ],
        }),

        deleteSeason: builder.mutation<ApiResponse<null>, number>({
            query: (id) => ({ url: `${BASE_URL}/${id}`, method: 'DELETE' }),
            invalidatesTags: (_result, _err, id) => [
                { type: 'Season', id },
                { type: 'Season', id: 'LIST' },
            ],
        }),

    }),
});

export const {
    useGetSeasonsQuery,
    useGetSeasonByIdQuery,
    useCreateSeasonMutation,
    useUpdateSeasonMutation,
    useDeleteSeasonMutation,
} = seasonsApi;
