import { mainApi, API_URL } from '../mainApi';
import { ApiResponse, PaginationResponse, PaginationFilter, GameResult } from '@/types';
import { GameInstance } from '@/types';

const BASE_URL = `${API_URL}/rooms`;

export interface CreateGameInstanceRequest {
    game_id: number;
    room_id: number;
    status: number;
}

export interface UpdateGameInstanceRequest extends Partial<CreateGameInstanceRequest> { }

export interface GameInstanceFilter extends PaginationFilter {
    game_id?: number;
    room_id?: number;
    status?: number;
    searchQuery?: string;
}

export const gameInstancesApi = mainApi.injectEndpoints({
    endpoints: (builder) => ({
        getGameInstances: builder.query<ApiResponse<PaginationResponse<GameInstance>>, GameInstanceFilter>({
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
                        ...result.data.items.map(({ id }) => ({ type: 'GameInstance' as const, id })),
                        { type: 'GameInstance', id: 'LIST' },
                    ]
                    : [{ type: 'GameInstance', id: 'LIST' }],
        }),

        getGameInstanceById: builder.query<ApiResponse<GameInstance>, number>({
            query: (id) => `${BASE_URL}/${id}`,
            providesTags: (_result, _err, id) => [{ type: 'GameInstance', id }],
        }),

        gameInstanceResults: builder.mutation<ApiResponse<GameResult>, number>({
            query: (gameId) => ({
                url: `${BASE_URL}/${gameId}/results`,
                method: "GET",
            }),
            invalidatesTags: (_result, _err, id) => [{ type: "GameInstance", id }],
        }),

        createGameInstance: builder.mutation<ApiResponse<GameInstance>, CreateGameInstanceRequest>({
            query: (body) => ({ url: BASE_URL, method: 'POST', body }),
            invalidatesTags: [{ type: 'GameInstance', id: 'LIST' }],
        }),

        updateGameInstance: builder.mutation<ApiResponse<GameInstance>, { id: number; body: UpdateGameInstanceRequest }>({
            query: ({ id, body }) => ({ url: `${BASE_URL}/${id}`, method: 'PUT', body }),
            invalidatesTags: (_result, _err, { id }) => [
                { type: 'GameInstance', id },
                { type: 'GameInstance', id: 'LIST' },
            ],
        }),

        deleteGameInstance: builder.mutation<ApiResponse<null>, number>({
            query: (id) => ({ url: `${BASE_URL}/${id}`, method: 'DELETE' }),
            invalidatesTags: (_result, _err, id) => [
                { type: 'GameInstance', id },
                { type: 'GameInstance', id: 'LIST' },
            ],
        }),
        leaveGameInstance: builder.mutation<ApiResponse<null>, number>({
            query: (id) => ({ url: `${BASE_URL}/${id}/leave`, method: 'POST' }),
            invalidatesTags: (_result, _err, id) => [
                { type: 'GameInstance', id },
                { type: 'GameInstance', id: 'LIST' },
            ],
        }),

    }),
});

export const {
    useGetGameInstancesQuery,
    useGetGameInstanceByIdQuery,
    useCreateGameInstanceMutation,
    useUpdateGameInstanceMutation,
    useDeleteGameInstanceMutation,
    useLeaveGameInstanceMutation,
    useGameInstanceResultsMutation,
} = gameInstancesApi;