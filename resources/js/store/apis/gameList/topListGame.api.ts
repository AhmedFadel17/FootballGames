import { mainApi, API_URL } from '../mainApi';
import { ApiResponse, TopListGameInstance, TopListGuess } from '@/types';

const BASE_URL = `${API_URL}/games-list/top-list`;

export interface CreateTopListGameRequest {
    difficulty?: number;
    game_instance_id?: number;
}

export interface SubmitTopListGuessRequest {
    gameId: number;
    objectId: number;
}

export const topListGameApi = mainApi.injectEndpoints({
    endpoints: (builder) => ({
        getTopListGameById: builder.query<ApiResponse<TopListGameInstance>, number>({
            query: (id) => `${BASE_URL}/${id}`,
            providesTags: (_result, _err, id) => [{ type: 'TopListGame' as const, id }],
        }),

        createTopListGame: builder.mutation<ApiResponse<TopListGameInstance>, CreateTopListGameRequest>({
            query: (body) => ({
                url: `${BASE_URL}/start`,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'TopListGame' as const, id: 'LIST' }],
        }),

        submitTopListGuess: builder.mutation<ApiResponse<TopListGuess>, SubmitTopListGuessRequest>({
            query: ({ gameId, objectId }) => ({
                url: `${BASE_URL}/${gameId}/check/${objectId}`,
                method: 'POST',
            }),
            invalidatesTags: [{ type: 'TopListGame' as const }],
        }),
    }),
});

export const {
    useGetTopListGameByIdQuery,
    useCreateTopListGameMutation,
    useSubmitTopListGuessMutation,
} = topListGameApi;