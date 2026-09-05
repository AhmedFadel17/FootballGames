import { mainApi, API_URL } from './../mainApi';
import { ApiResponse, PaginationResponse, PaginationFilter, LookupOption } from '@/types';
import { Cosmetic } from '@/types';

const BASE_URL = `${API_URL}/cosmetics`;

export interface CreateCosmeticRequest {
    name: string;
    slug: string;
    type: number;
    rarity: number;
    description?: string;
    img_src?: string;
    is_active: boolean;
}

export interface UpdateCosmeticRequest extends Partial<CreateCosmeticRequest> { }

export interface CosmeticFilter extends PaginationFilter {
    searchQuery?: string;
    type?: string;
    rarity?: string;
    is_active?: boolean;
}

export const cosmeticsApi = mainApi.injectEndpoints({
    endpoints: (builder) => ({
        getCosmetics: builder.query<ApiResponse<PaginationResponse<Cosmetic>>, CosmeticFilter>({
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
                        ...result.data.items.map(({ id }) => ({ type: 'Cosmetic' as const, id })),
                        { type: 'Cosmetic', id: 'LIST' },
                    ]
                    : [{ type: 'Cosmetic', id: 'LIST' }],
        }),

        getCosmeticsLookup: builder.query<ApiResponse<LookupOption[]>, { query: string; limit?: number }>({
            query: ({ query, limit = 10 }) => ({
                url: `${API_URL}/lookups/cosmetics`,
                params: { query, limit },
            }),
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'Cosmetic' as const, id })),
                        { type: 'Cosmetic', id: 'LOOKUP' },
                    ]
                    : [{ type: 'Cosmetic', id: 'LOOKUP' }],
        }),

        getCosmeticById: builder.query<ApiResponse<Cosmetic>, number>({
            query: (id) => `${BASE_URL}/${id}`,
            providesTags: (_result, _err, id) => [{ type: 'Cosmetic', id }],
        }),

        createCosmetic: builder.mutation<ApiResponse<Cosmetic>, CreateCosmeticRequest>({
            query: (body) => ({ url: BASE_URL, method: 'POST', body }),
            invalidatesTags: [{ type: 'Cosmetic', id: 'LIST' }],
        }),

        updateCosmetic: builder.mutation<ApiResponse<Cosmetic>, { id: number; body: UpdateCosmeticRequest }>({
            query: ({ id, body }) => ({ url: `${BASE_URL}/${id}`, method: 'PUT', body }),
            invalidatesTags: (_result, _err, { id }) => [
                { type: 'Cosmetic', id },
                { type: 'Cosmetic', id: 'LIST' },
            ],
        }),

        deleteCosmetic: builder.mutation<ApiResponse<null>, number>({
            query: (id) => ({ url: `${BASE_URL}/${id}`, method: 'DELETE' }),
            invalidatesTags: (_result, _err, id) => [
                { type: 'Cosmetic', id },
                { type: 'Cosmetic', id: 'LIST' },
            ],
        }),
    }),
});

export const {
    useGetCosmeticsQuery,
    useGetCosmeticByIdQuery,
    useCreateCosmeticMutation,
    useUpdateCosmeticMutation,
    useDeleteCosmeticMutation,
    useGetCosmeticsLookupQuery,
} = cosmeticsApi;