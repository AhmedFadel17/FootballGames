import { mainApi, API_URL } from './../mainApi';
import { ApiResponse, PaginationResponse, PaginationFilter } from '@/types';
import { PackDropRule } from '@/types';

const BASE_URL = `${API_URL}/pack-drop-rules`;

export interface CreatePackDropRuleRequest {
    pack_id: number;
    drop_type: string;
    item_type?: string;
    rarity?: number | null;
    event_id?: number | null;
    min_coins?: number;
    max_coins?: number;
    drop_percentage: number;
    drop_chance?: number;
}

export interface UpdatePackDropRuleRequest extends Partial<CreatePackDropRuleRequest> { }

export interface PackDropRuleFilter extends PaginationFilter {
    pack_id?: number;
    item_type?: string;
}

export const packDropRulesApi = mainApi.injectEndpoints({
    endpoints: (builder) => ({
        getPackDropRules: builder.query<ApiResponse<PaginationResponse<PackDropRule>>, PackDropRuleFilter>({
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
                        ...result.data.items.map(({ id }) => ({ type: 'PackDropRule' as const, id })),
                        { type: 'PackDropRule', id: 'LIST' },
                    ]
                    : [{ type: 'PackDropRule', id: 'LIST' }],
        }),

        getPackDropRuleById: builder.query<ApiResponse<PackDropRule>, number>({
            query: (id) => `${BASE_URL}/${id}`,
            providesTags: (_result, _err, id) => [{ type: 'PackDropRule', id }],
        }),

        createPackDropRule: builder.mutation<ApiResponse<PackDropRule>, CreatePackDropRuleRequest>({
            query: (body) => ({ url: BASE_URL, method: 'POST', body }),
            invalidatesTags: [
                { type: 'PackDropRule', id: 'LIST' },
                { type: 'Pack', id: 'LIST' },
            ],
        }),

        updatePackDropRule: builder.mutation<ApiResponse<PackDropRule>, { id: number; body: UpdatePackDropRuleRequest }>({
            query: ({ id, body }) => ({ url: `${BASE_URL}/${id}`, method: 'PUT', body }),
            invalidatesTags: (_result, _err, { id }) => [
                { type: 'PackDropRule', id },
                { type: 'PackDropRule', id: 'LIST' },
            ],
        }),

        deletePackDropRule: builder.mutation<ApiResponse<null>, number>({
            query: (id) => ({ url: `${BASE_URL}/${id}`, method: 'DELETE' }),
            invalidatesTags: (_result, _err, id) => [
                { type: 'PackDropRule', id },
                { type: 'PackDropRule', id: 'LIST' },
            ],
        }),
    }),
});

export const {
    useGetPackDropRulesQuery,
    useGetPackDropRuleByIdQuery,
    useCreatePackDropRuleMutation,
    useUpdatePackDropRuleMutation,
    useDeletePackDropRuleMutation,
} = packDropRulesApi;