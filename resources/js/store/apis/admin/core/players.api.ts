import { mainApi } from './../../mainApi';
import { ApiResponse, PaginationResponse, PaginationFilter } from '@/types';
import { Player } from '@/types';

export interface CreatePlayerRequest {
    name: string;
    fullname: string;
    position: number;
    date_of_birth: string;
    height_cm: number;
    weight_kg: number;
    popularity: number;
    rating: number;
    market_value: number;
    preferred_foot: number;
    slug: string;
    api_id?: number;
    img_src: string;
    country_id: number;
}

export interface UpdatePlayerRequest extends Partial<CreatePlayerRequest> { }

export interface PlayerFilter extends PaginationFilter {
    country_id?: number;
    searchQuery?: string;
}

export const playersApi = mainApi.injectEndpoints({
    endpoints: (builder) => ({
        getPlayers: builder.query<ApiResponse<PaginationResponse<Player>>, PlayerFilter>({
            query: (filter) => {
                const params = new URLSearchParams();

                Object.entries(filter).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        params.append(key, value.toString());
                    }
                });

                return {
                    url: '/api/v1/admin/players',
                    params: params,
                };
            },
            providesTags: (result) =>
                result?.data?.items
                    ? [
                        ...result.data.items.map(({ id }) => ({ type: 'Player' as const, id })),
                        { type: 'Player', id: 'LIST' },
                    ]
                    : [{ type: 'Player', id: 'LIST' }],
        }),

        getPlayerById: builder.query<ApiResponse<Player>, number>({
            query: (id) => `/api/v1/admin/players/${id}`,
            providesTags: (_result, _err, id) => [{ type: 'Player', id }],
        }),

        createPlayer: builder.mutation<ApiResponse<Player>, CreatePlayerRequest>({
            query: (body) => ({ url: '/api/v1/admin/players', method: 'POST', body }),
            invalidatesTags: [{ type: 'Player', id: 'LIST' }],
        }),

        updatePlayer: builder.mutation<ApiResponse<Player>, { id: number; body: UpdatePlayerRequest }>({
            query: ({ id, body }) => ({ url: `/api/v1/admin/players/${id}`, method: 'PUT', body }),
            invalidatesTags: (_result, _err, { id }) => [
                { type: 'Player', id },
                { type: 'Player', id: 'LIST' },
            ],
        }),

        deletePlayer: builder.mutation<ApiResponse<null>, number>({
            query: (id) => ({ url: `/api/v1/admin/players/${id}`, method: 'DELETE' }),
            invalidatesTags: (_result, _err, id) => [
                { type: 'Player', id },
                { type: 'Player', id: 'LIST' },
            ],
        }),

    }),
});

export const {
    useGetPlayersQuery,
    useGetPlayerByIdQuery,
    useCreatePlayerMutation,
    useUpdatePlayerMutation,
    useDeletePlayerMutation,
} = playersApi;
