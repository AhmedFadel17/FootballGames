import { mainApi, API_URL } from './../mainApi';
import { ApiResponse, PaginationResponse, PaginationFilter } from '@/types';
import { Competition, Team } from '@/types';

const BASE_URL = `${API_URL}/competitions`;

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
                    url: BASE_URL,
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
            query: (id) => `${BASE_URL}/${id}`,
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
                    url: `${BASE_URL}/${id}/teams`,
                    params,
                };
            },
            providesTags: (_result, _err, { id }) => [{ type: 'Competition', id: `TEAMS_${id}` }],
        }),

        createCompetition: builder.mutation<ApiResponse<Competition>, CreateCompetitionRequest>({
            query: (body) => ({ url: BASE_URL, method: 'POST', body }),
            invalidatesTags: [{ type: 'Competition', id: 'LIST' }],
        }),

        updateCompetition: builder.mutation<ApiResponse<Competition>, { id: number; body: UpdateCompetitionRequest }>({
            query: ({ id, body }) => ({ url: `${BASE_URL}/${id}`, method: 'PUT', body }),
            invalidatesTags: (_result, _err, { id }) => [
                { type: 'Competition', id },
                { type: 'Competition', id: 'LIST' },
            ],
        }),

        deleteCompetition: builder.mutation<ApiResponse<null>, number>({
            query: (id) => ({ url: `${BASE_URL}/${id}`, method: 'DELETE' }),
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
