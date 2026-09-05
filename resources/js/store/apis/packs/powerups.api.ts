import { mainApi, API_URL } from './../mainApi';
import { ApiResponse, PaginationResponse, PaginationFilter, LookupOption } from '@/types';
import { Powerup } from '@/types';

const BASE_URL = `${API_URL}/powerups`;

export interface CreatePowerupRequest {
    name: string;
    slug: string;
    type: number;
    rarity: number;
    description?: string;
    img_src?: string;
    multiplier?: number;
    duration?: number;
}

export interface UpdatePowerupRequest extends Partial<CreatePowerupRequest> { }

export interface PowerupFilter extends PaginationFilter {
    searchQuery?: string;
    type?: string;
    rarity?: string;
}

export const powerupsApi = mainApi.injectEndpoints({
    endpoints: (builder) => ({
        getPowerups: builder.query<ApiResponse<PaginationResponse<Powerup>>, PowerupFilter>({
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
                        ...result.data.items.map(({ id }) => ({ type: 'Powerup' as const, id })),
                        { type: 'Powerup', id: 'LIST' },
                    ]
                    : [{ type: 'Powerup', id: 'LIST' }],
        }),

        getPowerupsLookup: builder.query<ApiResponse<LookupOption[]>, { query: string; limit?: number }>({
            query: ({ query, limit = 10 }) => ({
                url: `${API_URL}/lookups/powerups`,
                params: { query, limit },
            }),
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'Powerup' as const, id })),
                        { type: 'Powerup', id: 'LOOKUP' },
                    ]
                    : [{ type: 'Powerup', id: 'LOOKUP' }],
        }),

        getPowerupById: builder.query<ApiResponse<Powerup>, number>({
            query: (id) => `${BASE_URL}/${id}`,
            providesTags: (_result, _err, id) => [{ type: 'Powerup', id }],
        }),

        createPowerup: builder.mutation<ApiResponse<Powerup>, CreatePowerupRequest>({
            query: (body) => ({ url: BASE_URL, method: 'POST', body }),
            invalidatesTags: [{ type: 'Powerup', id: 'LIST' }],
        }),

        updatePowerup: builder.mutation<ApiResponse<Powerup>, { id: number; body: UpdatePowerupRequest }>({
            query: ({ id, body }) => ({ url: `${BASE_URL}/${id}`, method: 'PUT', body }),
            invalidatesTags: (_result, _err, { id }) => [
                { type: 'Powerup', id },
                { type: 'Powerup', id: 'LIST' },
            ],
        }),

        deletePowerup: builder.mutation<ApiResponse<null>, number>({
            query: (id) => ({ url: `${BASE_URL}/${id}`, method: 'DELETE' }),
            invalidatesTags: (_result, _err, id) => [
                { type: 'Powerup', id },
                { type: 'Powerup', id: 'LIST' },
            ],
        }),
    }),
});

export const {
    useGetPowerupsQuery,
    useGetPowerupByIdQuery,
    useCreatePowerupMutation,
    useUpdatePowerupMutation,
    useDeletePowerupMutation,
    useGetPowerupsLookupQuery,
} = powerupsApi;