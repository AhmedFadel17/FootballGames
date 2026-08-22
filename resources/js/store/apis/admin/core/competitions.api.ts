import { mainApi } from './../../mainApi';
import { ApiResponse, PaginationResponse, PaginationFilter } from '@/types';
import { Competition, Team } from '@/types';

export interface CreateCompetitionRequest {
    name: string;
    abbr: string;
    country_id: number;
    type: number;
    founded_year: number;
    tier: number;
    img_src: string;
    popularity: number;
    is_active: boolean;
    slug?: string;
    api_id?: number;
}

export interface UpdateCompetitionRequest extends Partial<CreateCompetitionRequest> { }

export interface CompetitionFilter extends PaginationFilter {
    country_id?: number;
    searchQuery?: string;
}

export const competitionsApi = mainApi.injectEndpoints({
    endpoints: (builder) => ({
        getCompetitions: builder.query<ApiResponse<PaginationResponse<Competition>>, CompetitionFilter>({
            query: (filter) => {
                const params = new URLSearchParams();

                Object.entries(filter).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        params.append(key, value.toString());
                    }
                });

                return {
                    url: '/api/v1/admin/competitions',
                    params: params,
                };
            },
            providesTags: (result) =>
                result?.data?.items
                    ? [
                        ...result.data.items.map(({ id }) => ({ type: 'Competition' as const, id })),
                        { type: 'Competition', id: 'LIST' },
                    ]
                    : [{ type: 'Competition', id: 'LIST' }],
        }),

        getCompetitionById: builder.query<ApiResponse<Competition>, number>({
            query: (id) => `/api/v1/admin/competitions/${id}`,
            providesTags: (_result, _err, id) => [{ type: 'Competition', id }],
        }),

        getCompetitionTeams: builder.query<ApiResponse<PaginationResponse<Team>>, { id: number } & PaginationFilter>({
            query: ({ id, ...filter }) => {
                const params = new URLSearchParams();
                Object.entries(filter).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        params.append(key, value.toString());
                    }
                });

                return {
                    url: `/api/v1/admin/competitions/${id}/teams`,
                    params,
                };
            },
            providesTags: (_result, _err, { id }) => [{ type: 'Competition', id: `TEAMS_${id}` }],
        }),

        createCompetition: builder.mutation<ApiResponse<Competition>, CreateCompetitionRequest>({
            query: (body) => ({ url: '/api/v1/admin/competitions', method: 'POST', body }),
            invalidatesTags: [{ type: 'Competition', id: 'LIST' }],
        }),

        updateCompetition: builder.mutation<ApiResponse<Competition>, { id: number; body: UpdateCompetitionRequest }>({
            query: ({ id, body }) => ({ url: `/api/v1/admin/competitions/${id}`, method: 'PUT', body }),
            invalidatesTags: (_result, _err, { id }) => [
                { type: 'Competition', id },
                { type: 'Competition', id: 'LIST' },
            ],
        }),

        deleteCompetition: builder.mutation<ApiResponse<null>, number>({
            query: (id) => ({ url: `/api/v1/admin/competitions/${id}`, method: 'DELETE' }),
            invalidatesTags: (_result, _err, id) => [
                { type: 'Competition', id },
                { type: 'Competition', id: 'LIST' },
            ],
        }),

    }),
});

export const {
    useGetCompetitionsQuery,
    useGetCompetitionByIdQuery,
    useGetCompetitionTeamsQuery,
    useCreateCompetitionMutation,
    useUpdateCompetitionMutation,
    useDeleteCompetitionMutation,
} = competitionsApi;
