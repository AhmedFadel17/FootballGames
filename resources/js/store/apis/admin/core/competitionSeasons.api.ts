import { mainApi } from '../../mainApi';
import { ApiResponse, PaginationResponse, PaginationFilter } from '@/types';
import { CompetitionSeason, Standing } from '@/types';

export interface CreateCompetitionSeasonRequest {
    competition_id: number;
    season_id: number;
    winner_team_id?: number;
}

export interface UpdateCompetitionSeasonRequest extends Partial<CreateCompetitionSeasonRequest> { }

export interface CompetitionSeasonFilter extends PaginationFilter {
    competition_id?: number;
    season_id?: number;
    winner_team_id?: number;
    searchQuery?: string;
}

export const competitionSeasonsApi = mainApi.injectEndpoints({
    endpoints: (builder) => ({
        getCompetitionSeasons: builder.query<ApiResponse<PaginationResponse<CompetitionSeason>>, CompetitionSeasonFilter>({
            query: (filter) => {
                const params = new URLSearchParams();

                Object.entries(filter).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        params.append(key, value.toString());
                    }
                });

                return {
                    url: '/api/v1/admin/competition-seasons',
                    params: params,
                };
            },
            providesTags: (result) =>
                result?.data?.items
                    ? [
                        ...result.data.items.map(({ id }) => ({ type: 'CompetitionSeason' as const, id })),
                        { type: 'CompetitionSeason', id: 'LIST' },
                    ]
                    : [{ type: 'CompetitionSeason', id: 'LIST' }],
        }),

        getCompetitionSeasonById: builder.query<ApiResponse<CompetitionSeason>, number>({
            query: (id) => `/api/v1/admin/competition-seasons/${id}`,
            providesTags: (_result, _err, id) => [{ type: 'CompetitionSeason', id }],
        }),

        getCompetitionSeasonStandings: builder.query<ApiResponse<Standing[]>, number>({
            query: (id) => `/api/v1/admin/competition-seasons/${id}/standings`,
            providesTags: (_result, _err, id) => [{ type: 'CompetitionSeason', id: `STANDINGS_${id}` }],
        }),

        createCompetitionSeason: builder.mutation<ApiResponse<CompetitionSeason>, CreateCompetitionSeasonRequest>({
            query: (body) => ({ url: '/api/v1/admin/competition-seasons', method: 'POST', body }),
            invalidatesTags: [{ type: 'CompetitionSeason', id: 'LIST' }],
        }),

        updateCompetitionSeason: builder.mutation<ApiResponse<CompetitionSeason>, { id: number; body: UpdateCompetitionSeasonRequest }>({
            query: ({ id, body }) => ({ url: `/api/v1/admin/competition-seasons/${id}`, method: 'PUT', body }),
            invalidatesTags: (_result, _err, { id }) => [
                { type: 'CompetitionSeason', id },
                { type: 'CompetitionSeason', id: 'LIST' },
            ],
        }),

        deleteCompetitionSeason: builder.mutation<ApiResponse<null>, number>({
            query: (id) => ({ url: `/api/v1/admin/competition-seasons/${id}`, method: 'DELETE' }),
            invalidatesTags: (_result, _err, id) => [
                { type: 'CompetitionSeason', id },
                { type: 'CompetitionSeason', id: 'LIST' },
            ],
        }),

    }),
});

export const {
    useGetCompetitionSeasonsQuery,
    useGetCompetitionSeasonByIdQuery,
    useGetCompetitionSeasonStandingsQuery,
    useCreateCompetitionSeasonMutation,
    useUpdateCompetitionSeasonMutation,
    useDeleteCompetitionSeasonMutation,
} = competitionSeasonsApi;
