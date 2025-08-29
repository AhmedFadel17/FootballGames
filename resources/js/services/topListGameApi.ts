import { api } from "./api";

export const topListGameApi = api.injectEndpoints({
    endpoints: (builder) => ({

        checkTopListAnswer: builder.mutation<any, { gameId: number; objectId: number }>({
            query: ({ gameId, objectId }) => ({
                url: `/api/v1/u/games-list/top-list/${gameId}/check/${objectId}`,
                method: "POST",
            }),
        }),

        startTopListGame: builder.mutation<any, number>({
            query: (gameId) => ({
                url: `/api/v1/u/games-list/top-list/${gameId}/start`,
                method: "POST",
            }),
        }),

        cancelTopListGame: builder.mutation<any, number>({
            query: (gameId) => ({
                url: `/api/v1/u/games-list/top-list/${gameId}/cancel`,
                method: "POST",
            }),
        }),

        topListGameResults: builder.mutation<any, number>({
            query: (gameId) => ({
                url: `/api/v1/u/games-list/top-list/${gameId}/results`,
            }),
        }),
    }),
});

export const {
    useCancelTopListGameMutation,
    useCheckTopListAnswerMutation,
    useStartTopListGameMutation,
    useTopListGameResultsMutation
} = topListGameApi;
