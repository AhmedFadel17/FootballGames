import { mainApi, API_URL } from './../mainApi';
import { ApiResponse, PaginationResponse, PaginationFilter, LookupOption } from '@/types';
import { PlayerCard } from '@/types';

const BASE_URL = `${API_URL}/player-cards`;

export interface CreatePlayerCardRequest {
    player_id: number;
    event_id?: number;
    rating: number;
    rarity: string;
    position: string;
    img_src?: string;
    stats?: Record<string, number>;
}

export interface UpdatePlayerCardRequest extends Partial<CreatePlayerCardRequest> { }

export interface PlayerCardFilter extends PaginationFilter {
    searchQuery?: string;
    player_id?: number;
    event_id?: number;
    rarity?: string;
    position?: string;
}

export const playerCardsApi = mainApi.injectEndpoints({
    endpoints: (builder) => ({
        getPlayerCards: builder.query<ApiResponse<PaginationResponse<PlayerCard>>, PlayerCardFilter>({
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
                        ...result.data.items.map(({ id }) => ({ type: 'PlayerCard' as const, id })),
                        { type: 'PlayerCard', id: 'LIST' },
                    ]
                    : [{ type: 'PlayerCard', id: 'LIST' }],
        }),

        getPlayerCardsLookup: builder.query<ApiResponse<LookupOption[]>, { query: string; limit?: number }>({
            query: ({ query, limit = 10 }) => ({
                url: `${API_URL}/lookups/player-cards`,
                params: { query, limit },
            }),
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'PlayerCard' as const, id })),
                        { type: 'PlayerCard', id: 'LOOKUP' },
                    ]
                    : [{ type: 'PlayerCard', id: 'LOOKUP' }],
        }),

        getPlayerCardById: builder.query<ApiResponse<PlayerCard>, number>({
            query: (id) => `${BASE_URL}/${id}`,
            providesTags: (_result, _err, id) => [{ type: 'PlayerCard', id }],
        }),

        createPlayerCard: builder.mutation<ApiResponse<PlayerCard>, CreatePlayerCardRequest>({
            query: (body) => ({ url: BASE_URL, method: 'POST', body }),
            invalidatesTags: [{ type: 'PlayerCard', id: 'LIST' }],
        }),

        updatePlayerCard: builder.mutation<ApiResponse<PlayerCard>, { id: number; body: UpdatePlayerCardRequest }>({
            query: ({ id, body }) => ({ url: `${BASE_URL}/${id}`, method: 'PUT', body }),
            invalidatesTags: (_result, _err, { id }) => [
                { type: 'PlayerCard', id },
                { type: 'PlayerCard', id: 'LIST' },
            ],
        }),

        deletePlayerCard: builder.mutation<ApiResponse<null>, number>({
            query: (id) => ({ url: `${BASE_URL}/${id}`, method: 'DELETE' }),
            invalidatesTags: (_result, _err, id) => [
                { type: 'PlayerCard', id },
                { type: 'PlayerCard', id: 'LIST' },
            ],
        }),
    }),
});

export const {
    useGetPlayerCardsQuery,
    useGetPlayerCardByIdQuery,
    useCreatePlayerCardMutation,
    useUpdatePlayerCardMutation,
    useDeletePlayerCardMutation,
    useGetPlayerCardsLookupQuery,
} = playerCardsApi;