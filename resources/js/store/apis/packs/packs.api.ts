import { mainApi, API_URL } from './../mainApi';
import { ApiResponse, PaginationResponse, PaginationFilter, LookupOption } from '@/types';
import { Pack, PackOpeningResult } from '@/types';

const BASE_URL = `${API_URL}/packs`;

export interface CreatePackRequest {
    event_id?: number;
    name: string;
    description?: string;
    img_src?: string;
    price_coins: number;
    cards_count: number;
    is_active: boolean;
}

export interface UpdatePackRequest extends Partial<CreatePackRequest> { }

export interface OpenPackRequest {
    pack_id: number;
}

export interface PackFilter extends PaginationFilter {
    searchQuery?: string;
    event_id?: number;
    is_active?: boolean;
}

export const packsApi = mainApi.injectEndpoints({
    endpoints: (builder) => ({
        getPacks: builder.query<ApiResponse<PaginationResponse<Pack>>, PackFilter>({
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
                        ...result.data.items.map(({ id }) => ({ type: 'Pack' as const, id })),
                        { type: 'Pack', id: 'LIST' },
                    ]
                    : [{ type: 'Pack', id: 'LIST' }],
        }),

        getPacksLookup: builder.query<ApiResponse<LookupOption[]>, { query: string; limit?: number }>({
            query: ({ query, limit = 10 }) => ({
                url: `${API_URL}/lookups/packs`,
                params: { query, limit },
            }),
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'Pack' as const, id })),
                        { type: 'Pack', id: 'LOOKUP' },
                    ]
                    : [{ type: 'Pack', id: 'LOOKUP' }],
        }),

        getPackById: builder.query<ApiResponse<Pack>, number>({
            query: (id) => `${BASE_URL}/${id}`,
            providesTags: (_result, _err, id) => [{ type: 'Pack', id }],
        }),

        createPack: builder.mutation<ApiResponse<Pack>, CreatePackRequest>({
            query: (body) => ({ url: BASE_URL, method: 'POST', body }),
            invalidatesTags: [{ type: 'Pack', id: 'LIST' }],
        }),

        updatePack: builder.mutation<ApiResponse<Pack>, { id: number; body: UpdatePackRequest }>({
            query: ({ id, body }) => ({ url: `${BASE_URL}/${id}`, method: 'PUT', body }),
            invalidatesTags: (_result, _err, { id }) => [
                { type: 'Pack', id },
                { type: 'Pack', id: 'LIST' },
            ],
        }),

        deletePack: builder.mutation<ApiResponse<null>, number>({
            query: (id) => ({ url: `${BASE_URL}/${id}`, method: 'DELETE' }),
            invalidatesTags: (_result, _err, id) => [
                { type: 'Pack', id },
                { type: 'Pack', id: 'LIST' },
            ],
        }),

        openPack: builder.mutation<ApiResponse<PackOpeningResult>, OpenPackRequest>({
            query: (body) => ({ url: `${BASE_URL}/open`, method: 'POST', body }),
            invalidatesTags: [{ type: 'Pack', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetPacksQuery,
    useGetPackByIdQuery,
    useCreatePackMutation,
    useUpdatePackMutation,
    useDeletePackMutation,
    useGetPacksLookupQuery,
    useOpenPackMutation,
} = packsApi;