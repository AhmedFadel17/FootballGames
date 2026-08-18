import { mainApi } from './../../mainApi';
import { ApiResponse, PaginationResponse, PaginationFilter } from '@/types';
import { Manager } from '@/types';

export interface CreateManagerRequest {
    name: string;
    popularity: number;
    img_src: string;
    slug?: string;
    api_id?: number;
    country_id: number;
}

export interface UpdateManagerRequest extends Partial<CreateManagerRequest> { }

export interface ManagerFilter extends PaginationFilter {
    searchQuery?: string;
}

export const managersApi = mainApi.injectEndpoints({
    endpoints: (builder) => ({
        getManagers: builder.query<ApiResponse<PaginationResponse<Manager>>, ManagerFilter>({
            query: (filter) => {
                const params = new URLSearchParams();

                Object.entries(filter).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        params.append(key, value.toString());
                    }
                });

                return {
                    url: '/api/v1/admin/managers',
                    params: params,
                };
            },
            providesTags: (result) =>
                result?.data?.items
                    ? [
                        ...result.data.items.map(({ id }) => ({ type: 'Manager' as const, id })),
                        { type: 'Manager', id: 'LIST' },
                    ]
                    : [{ type: 'Manager', id: 'LIST' }],
        }),

        getManagerById: builder.query<ApiResponse<Manager>, number>({
            query: (id) => `/api/v1/admin/managers/${id}`,
            providesTags: (_result, _err, id) => [{ type: 'Manager', id }],
        }),

        createManager: builder.mutation<ApiResponse<Manager>, CreateManagerRequest>({
            query: (body) => ({ url: '/api/v1/admin/managers', method: 'POST', body }),
            invalidatesTags: [{ type: 'Manager', id: 'LIST' }],
        }),

        updateManager: builder.mutation<ApiResponse<Manager>, { id: number; body: UpdateManagerRequest }>({
            query: ({ id, body }) => ({ url: `/api/v1/admin/managers/${id}`, method: 'PUT', body }),
            invalidatesTags: (_result, _err, { id }) => [
                { type: 'Manager', id },
                { type: 'Manager', id: 'LIST' },
            ],
        }),

        deleteManager: builder.mutation<ApiResponse<null>, number>({
            query: (id) => ({ url: `/api/v1/admin/managers/${id}`, method: 'DELETE' }),
            invalidatesTags: (_result, _err, id) => [
                { type: 'Manager', id },
                { type: 'Manager', id: 'LIST' },
            ],
        }),

    }),
});

export const {
    useGetManagersQuery,
    useGetManagerByIdQuery,
    useCreateManagerMutation,
    useUpdateManagerMutation,
    useDeleteManagerMutation,
} = managersApi;
