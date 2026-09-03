import { mainApi, API_URL } from './../mainApi';
import { ApiResponse, PaginationResponse, PaginationFilter, LookupOption } from '@/types';
import { Team } from '@/types';

const BASE_URL = `${API_URL}/teams`;
export interface CreateTeamRequest {
    name: string;
    slug: string;
    abbr: string;
    popularity: number;
    api_id?: number;
    img_src: string;
    country_id: number;
    type: number;
    current_competition_id?: number;
}

export interface UpdateTeamRequest extends Partial<CreateTeamRequest> { }

export interface TeamFilter extends PaginationFilter {
    country_id?: number;
    current_competition_id?: number;
    searchQuery?: string;
}

export const teamsApi = mainApi.injectEndpoints({
    endpoints: (builder) => ({
        getTeams: builder.query<ApiResponse<PaginationResponse<Team>>, TeamFilter>({
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
                        ...result.data.items.map(({ id }) => ({ type: 'Team' as const, id })),
                        { type: 'Team', id: 'LIST' },
                    ]
                    : [{ type: 'Team', id: 'LIST' }],
        }),
        getTeamsLookup: builder.query<ApiResponse<LookupOption[]>, { query: string, limit?: number }>({
            query: ({ query, limit = 10 }) => ({
                url: `${API_URL}/lookups/teams`,
                params: { query, limit },
            }),
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'Team' as const, id })),
                        { type: 'Team', id: 'LOOKUP' },
                    ]
                    : [{ type: 'Team', id: 'LOOKUP' }],
        }),

        getTeamById: builder.query<ApiResponse<Team>, number>({
            query: (id) => `${BASE_URL}/${id}`,
            providesTags: (_result, _err, id) => [{ type: 'Team', id }],
        }),

        createTeam: builder.mutation<ApiResponse<Team>, CreateTeamRequest>({
            query: (body) => ({ url: BASE_URL, method: 'POST', body }),
            invalidatesTags: [{ type: 'Team', id: 'LIST' }],
        }),

        updateTeam: builder.mutation<ApiResponse<Team>, { id: number; body: UpdateTeamRequest }>({
            query: ({ id, body }) => ({ url: `${BASE_URL}/${id}`, method: 'PUT', body }),
            invalidatesTags: (_result, _err, { id }) => [
                { type: 'Team', id },
                { type: 'Team', id: 'LIST' },
            ],
        }),

        deleteTeam: builder.mutation<ApiResponse<null>, number>({
            query: (id) => ({ url: `${BASE_URL}/${id}`, method: 'DELETE' }),
            invalidatesTags: (_result, _err, id) => [
                { type: 'Team', id },
                { type: 'Team', id: 'LIST' },
            ],
        }),

    }),
});

export const {
    useGetTeamsQuery,
    useGetTeamByIdQuery,
    useCreateTeamMutation,
    useUpdateTeamMutation,
    useDeleteTeamMutation,
    useGetTeamsLookupQuery
} = teamsApi;
