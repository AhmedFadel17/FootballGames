import { mainApi, API_URL } from '../mainApi';
import { ApiResponse, PaginationResponse, PaginationFilter } from '@/types';
import { Game } from '@/types';

const BASE_URL = `${API_URL}/games`;

export interface CreateGameRequest {
    name: string;
    slug: string;
    description: string;
    max_players: number;
    min_players: number;
    is_active: boolean;
}

export interface UpdateGameRequest extends Partial<CreateGameRequest> { }

export interface GameFilter extends PaginationFilter {
    searchQuery?: string;
}

export const gamesApi = mainApi.injectEndpoints({
    endpoints: (builder) => ({
        getGames: builder.query<ApiResponse<PaginationResponse<Game>>, GameFilter>({
            query: (filter) => {
                const params = Object.fromEntries(
                    Object.entries(filter).filter(
                        ([, value]) => value !== undefined && value !== null && value !== ''
                    )
                );

                return {
                    url: BASE_URL,
                    params,
                };
            },
            providesTags: (result) =>
                result?.data?.items
                    ? [
                        ...result.data.items.map(({ id }) => ({ type: 'Game' as const, id })),
                        { type: 'Game', id: 'LIST' },
                    ]
                    : [{ type: 'Game', id: 'LIST' }],
        }),

        getGameById: builder.query<ApiResponse<Game>, number>({
            query: (id) => `${BASE_URL}/${id}`,
            providesTags: (_result, _err, id) => [{ type: 'Game', id }],
        }),

        createGame: builder.mutation<ApiResponse<Game>, CreateGameRequest>({
            query: (body) => ({ url: BASE_URL, method: 'POST', body }),
            invalidatesTags: [{ type: 'Game', id: 'LIST' }],
        }),

        updateGame: builder.mutation<ApiResponse<Game>, { id: number; body: UpdateGameRequest }>({
            query: ({ id, body }) => ({ url: `${BASE_URL}/${id}`, method: 'PUT', body }),
            invalidatesTags: (_result, _err, { id }) => [
                { type: 'Game', id },
                { type: 'Game', id: 'LIST' },
            ],
        }),

        deleteGame: builder.mutation<ApiResponse<null>, number>({
            query: (id) => ({ url: `${BASE_URL}/${id}`, method: 'DELETE' }),
            invalidatesTags: (_result, _err, id) => [
                { type: 'Game', id },
                { type: 'Game', id: 'LIST' },
            ],
        }),

    }),
});

export const {
    useGetGamesQuery,
    useGetGameByIdQuery,
    useCreateGameMutation,
    useUpdateGameMutation,
    useDeleteGameMutation,
} = gamesApi;