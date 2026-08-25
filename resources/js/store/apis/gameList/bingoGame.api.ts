import { mainApi, API_URL } from '../mainApi';
import { ApiResponse, PaginationResponse, PaginationFilter } from '@/types';
import { BingoGame } from '@/types';

const BASE_URL = `${API_URL}/games-list/bingo`;

export interface CreateBingoGameRequest {
    game_id: number;
    difficulty: number;
    size: number;
    competition_slug?: string;
}

export interface UpdateBingoGameRequest extends Partial<CreateBingoGameRequest> { }

export interface BingoGameFilter extends PaginationFilter {
    searchQuery?: string;
}

export const bingoGameApi = mainApi.injectEndpoints({
    endpoints: (builder) => ({

        getBingoGameById: builder.query<ApiResponse<BingoGame>, number>({
            query: (id) => `${BASE_URL}/${id}`,
            providesTags: (_result, _err, id) => [{ type: 'BingoGame', id }],
        }),

        createBingoGame: builder.mutation<ApiResponse<BingoGame>, CreateBingoGameRequest>({
            query: (body) => ({ url: BASE_URL, method: 'POST', body }),
            invalidatesTags: [{ type: 'BingoGame', id: 'LIST' }],
        }),

        getBingoConditions: builder.query<any, number>({
            query: (gameId) => ({
                url: `${BASE_URL}/${gameId}/conditions`,
            }),
            providesTags: ["BingoGame"],
        }),
        getNextBingoMatch: builder.query<any, number>({
            query: (gameId) => ({
                url: `${BASE_URL}/${gameId}/next-match`,
            }),
            providesTags: ["BingoGame"],
        }),

        // Check a specific condition
        checkBingoCondition: builder.mutation<any, { gameId: number; pos: number }>({
            query: ({ gameId, pos }) => ({
                url: `${BASE_URL}/${gameId}/check/${pos}`,
                method: "POST",
            }),
            invalidatesTags: ["BingoGame"],
        }),


        // Skip a specific match
        skipBingoMatch: builder.mutation<any, number>({
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
    useCreateBingoGameMutation,
    useGetBingoConditionsQuery,
    useGetNextBingoMatchQuery,
    useCheckBingoConditionMutation,
    useSkipBingoMatchMutation,
} = bingoGameApi;