import { mainApi, API_URL } from '../mainApi';
import { ApiResponse, GridGame, GridAnswer, GridCondition } from '@/types';

const BASE_URL = `${API_URL}/games-list/football-grid`;

export interface CreateGridGameRequest {
    game_id: number;
    difficulty: number;
    size: number;
}

export interface SubmitGridAnswerRequest {
    player_id: number;
    row: number;
    col: number;
}

export interface SubmitGridAnswerResponse {
    answer: GridAnswer;
    is_complete: boolean;
}

export const gridGameApi = mainApi.injectEndpoints({
    endpoints: (builder) => ({

        getGridGameById: builder.query<ApiResponse<GridGame>, number>({
            query: (id) => `${BASE_URL}/${id}`,
            providesTags: (_result, _err, id) => [{ type: 'GridGame', id }],
        }),

        createGridGame: builder.mutation<ApiResponse<GridGame>, CreateGridGameRequest>({
            query: (body) => ({ url: BASE_URL, method: 'POST', body }),
            invalidatesTags: [{ type: 'GridGame', id: 'LIST' }],
        }),

        submitGridAnswer: builder.mutation<ApiResponse<SubmitGridAnswerResponse>, { gameId: number; body: SubmitGridAnswerRequest }>({
            query: ({ gameId, body }) => ({
                url: `${BASE_URL}/${gameId}/submit`,
                method: "POST",
                body
            }),
            invalidatesTags: ["GridGame"],
        }),

    }),
});

export const {
    useGetGridGameByIdQuery,
    useCreateGridGameMutation,
    useSubmitGridAnswerMutation,
} = gridGameApi;