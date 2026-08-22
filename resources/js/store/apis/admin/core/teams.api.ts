import { mainApi } from './../../mainApi';
import { ApiResponse, PaginationResponse, PaginationFilter } from '@/types';
import { Team } from '@/types';

export interface CreateTeamRequest {
    name: string;
    slug: string;
    abbr: string;
    popularity: number;
    api_id?: number;
    img_src: string;
    country_id: number;
}

export interface UpdateTeamRequest extends Partial<CreateTeamRequest> { }

export interface TeamFilter extends PaginationFilter {
    country_id?: number;
    competition_id?: number;
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
                    url: '/api/v1/admin/teams',
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

        getTeamById: builder.query<ApiResponse<Team>, number>({
            query: (id) => `/api/v1/admin/teams/${id}`,
            providesTags: (_result, _err, id) => [{ type: 'Team', id }],
        }),

        createTeam: builder.mutation<ApiResponse<Team>, CreateTeamRequest>({
            query: (body) => ({ url: '/api/v1/admin/teams', method: 'POST', body }),
            invalidatesTags: [{ type: 'Team', id: 'LIST' }],
        }),

        updateTeam: builder.mutation<ApiResponse<Team>, { id: number; body: UpdateTeamRequest }>({
            query: ({ id, body }) => ({ url: `/api/v1/admin/teams/${id}`, method: 'PUT', body }),
            invalidatesTags: (_result, _err, { id }) => [
                { type: 'Team', id },
                { type: 'Team', id: 'LIST' },
            ],
        }),

        deleteTeam: builder.mutation<ApiResponse<null>, number>({
            query: (id) => ({ url: `/api/v1/admin/teams/${id}`, method: 'DELETE' }),
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
} = teamsApi;
