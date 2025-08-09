import { api } from "./api";

export const bingoApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // Get all conditions for a game
        getBingoConditions: builder.query<any, number>({
            query: (gameId) => ({
                url: `/api/v1/u/games-list/bingo/${gameId}/conditions`,
            }),
            providesTags: ["BingoConditions"],
        }),

        // Get next match for a game
        getNextBingoMatch: builder.query<any, number>({
            query: (gameId) => ({
                url: `/api/v1/u/games-list/bingo/${gameId}/next-match`,
            }),
            providesTags: ["BingoMatch"],
        }),

        // Check a specific condition
        checkBingoCondition: builder.mutation<any, { gameId: number; pos: number }>({
            query: ({ gameId, pos }) => ({
                url: `/api/v1/u/games-list/bingo/${gameId}/check/${pos}`,
                method: "POST",
            }),
            invalidatesTags: ["BingoConditions"],
        }),


        // Skip a specific match
        skipBingoMatch: builder.mutation<any, number>({
            query: (gameId) => ({
                url: `/api/v1/u/games-list/bingo/${gameId}/skip`,
                method: "POST",
            }),
            invalidatesTags: ["BingoMatch"],
        }),

        // Create a new bingo game
        createBingoGame: builder.mutation<any, { game_id: number; size: number }>({
            query: (body) => ({
                url: `bingo-games`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["BingoGame"],
        }),

        // Cancel a bingo game
        cancelBingoGame: builder.mutation<any, number>({
            query: (gameId) => ({
                url: `/api/v1/u/games-list/bingo/${gameId}/cancel`,
            }),
            invalidatesTags: ["BingoGame"],
        }),

        // get bingo game results
        bingoGameResults: builder.mutation<any, number>({
            query: (gameId) => ({
                url: `/api/v1/u/games-list/bingo/${gameId}/results`,
            }),
            invalidatesTags: ["BingoGame"],
        }),
    }),
});

export const {
    useGetBingoConditionsQuery,
    useGetNextBingoMatchQuery,
    useCheckBingoConditionMutation,
    useSkipBingoMatchMutation,
    useCreateBingoGameMutation,
    useBingoGameResultsMutation,
} = bingoApi;
