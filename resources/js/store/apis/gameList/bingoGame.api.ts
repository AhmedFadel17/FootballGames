import { mainApi, API_URL } from '../mainApi';
import { ApiResponse, PaginationResponse, PaginationFilter, BingoGuess, BingoMatch, BingoGameInstance, BingoCondition } from '@/types';
import { BingoGame } from '@/types';

const BASE_URL = `${API_URL}/games-list/bingo`;

export interface CreateBingoGameRequest {
    difficulty: number;
    size: number;
}
export interface SubmitBingoGuessResponse {
    guess: BingoGuess;
    is_complete: boolean;
}

export interface SkipBingoMatchResponse {
    match: BingoMatch;
    is_complete: boolean;
}
export interface UpdateBingoGameRequest extends Partial<CreateBingoGameRequest> { }

export const bingoGameApi = mainApi.injectEndpoints({
    endpoints: (builder) => ({

        getBingoGameById: builder.query<ApiResponse<BingoGameInstance>, number>({
            query: (id) => `${BASE_URL}/${id}`,
            providesTags: (_result, _err, id) => [{ type: 'BingoGame', id }],
        }),

        startBingoGame: builder.mutation<ApiResponse<BingoGameInstance>, CreateBingoGameRequest>({
            query: (body) => ({ url: BASE_URL, method: 'POST', body }),
            invalidatesTags: [{ type: 'BingoGame', id: 'LIST' }],
        }),

        getBingoConditions: builder.query<ApiResponse<BingoCondition[]>, number>({
            query: (gameId) => ({
                url: `${BASE_URL}/${gameId}/conditions`,
            }),
            providesTags: ["BingoGame"],
        }),
        getNextBingoMatch: builder.query<ApiResponse<BingoMatch>, number>({
            query: (gameId) => ({
                url: `${BASE_URL}/${gameId}/next-match`,
            }),
            providesTags: ["BingoGame"],
        }),

        // Check a specific condition
        checkBingoCondition: builder.mutation<ApiResponse<SubmitBingoGuessResponse>, { gameId: number; pos: number }>({
            query: ({ gameId, pos }) => ({
                url: `${BASE_URL}/${gameId}/check/${pos}`,
                method: "POST",
            }),
            invalidatesTags: ["BingoGame"],
        }),


        // Skip a specific match
        skipBingoMatch: builder.mutation<ApiResponse<SkipBingoMatchResponse>, number>({
            query: (gameId) => ({
                url: `${BASE_URL}/${gameId}/skip`,
                method: "POST",
            }),
            invalidatesTags: ["BingoGame"],
        }),

    }),
});

export const {
    useGetBingoGameByIdQuery,
    useStartBingoGameMutation,
    useGetBingoConditionsQuery,
    useGetNextBingoMatchQuery,
    useCheckBingoConditionMutation,
    useSkipBingoMatchMutation,
} = bingoGameApi;