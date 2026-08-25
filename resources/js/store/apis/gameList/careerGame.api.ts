import { mainApi, API_URL } from "../mainApi";
import { ApiResponse, PaginationResponse, PaginationFilter, CareerGame } from "@/types";

const BASE_URL = `${API_URL}/games-list/career`;

export interface CreateCareerGameRequest {
    game_id: number;
    difficulty: number;
}

export interface GuessCareerGameRequest {
    gameId: number;
    guessedPlayerId: number;
}

export interface GuessCareerResponse {
    correct: boolean;
    attempts_left: number;
    score?: number;
    bonus?: number;
}

export interface CareerGameFilter extends PaginationFilter {
    searchQuery?: string;
}

export const careerGameApi = mainApi.injectEndpoints({
    endpoints: (builder) => ({
        getCareerGames: builder.query<ApiResponse<PaginationResponse<CareerGame>>, CareerGameFilter>({
            query: (filter) => {
                const params = Object.fromEntries(
                    Object.entries(filter).filter(
                        ([, value]) => value !== undefined && value !== null && value !== ""
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
                        ...result.data.items.map(({ id }) => ({ type: "CareerGame" as const, id })),
                        { type: "CareerGame", id: "LIST" },
                    ]
                    : [{ type: "CareerGame", id: "LIST" }],
        }),

        getCareerGameById: builder.query<ApiResponse<CareerGame>, number>({
            query: (id) => `${BASE_URL}/${id}`,
            providesTags: (_result, _err, id) => [{ type: "CareerGame", id }],
        }),

        createCareerGame: builder.mutation<ApiResponse<CareerGame>, CreateCareerGameRequest>({
            query: (body) => ({
                url: BASE_URL,
                method: "POST",
                body
            }),
            invalidatesTags: [{ type: "CareerGame", id: "LIST" }],
        }),

        revealNextCareerGameStep: builder.mutation<ApiResponse<CareerGame>, { gameId: number }>({
            query: ({ gameId }) => ({
                url: `${BASE_URL}/${gameId}/reveal`,
                method: "POST",
            }),
            invalidatesTags: (_result, _err, { gameId }) => [{ type: "CareerGame", id: gameId }],
        }),

        guessCareerGameStep: builder.mutation<ApiResponse<GuessCareerResponse>, GuessCareerGameRequest>({
            query: ({ gameId, guessedPlayerId }) => ({
                url: `${BASE_URL}/${gameId}/guess`,
                method: "POST",
                body: { guessed_player_id: guessedPlayerId },
            }),
            invalidatesTags: (_result, _err, { gameId }) => [{ type: "CareerGame", id: gameId }],
        }),

        cancelCareerGame: builder.mutation<ApiResponse<null>, number>({
            query: (gameId) => ({
                url: `${BASE_URL}/${gameId}/cancel`,
                method: "POST",
            }),
            invalidatesTags: (_result, _err, id) => [{ type: "CareerGame", id }],
        }),

        careerGameResults: builder.mutation<ApiResponse<any>, number>({
            query: (gameId) => ({
                url: `${BASE_URL}/${gameId}/results`,
                method: "GET",
            }),
            invalidatesTags: (_result, _err, id) => [{ type: "CareerGame", id }],
        }),
    }),
});

export const {
    useGetCareerGamesQuery,
    useGetCareerGameByIdQuery,
    useCreateCareerGameMutation,
    useRevealNextCareerGameStepMutation,
    useGuessCareerGameStepMutation,
    useCancelCareerGameMutation,
    useCareerGameResultsMutation,
} = careerGameApi;