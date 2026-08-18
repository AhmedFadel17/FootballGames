import { mainApi } from './../../mainApi';
import { ApiResponse, PaginationResponse, PaginationFilter, Lookup, LookupOption } from '@/types';
import { Country } from '@/types';

export interface CreateCountryRequest {
    name: string;
    code: string;
    popularity: number;
    continent_id: number;
}

export interface UpdateCountryRequest extends Partial<CreateCountryRequest> { }

export interface CountryFilter extends PaginationFilter {
    searchQuery?: string;
}

export const countriesApi = mainApi.injectEndpoints({
    endpoints: (builder) => ({
        getCountries: builder.query<ApiResponse<PaginationResponse<Country>>, CountryFilter>({
            query: (filter) => {
                const params = new URLSearchParams();

                Object.entries(filter).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        params.append(key, value.toString());
                    }
                });

                return {
                    url: '/api/v1/admin/countries',
                    params: params,
                };
            },
            providesTags: (result) =>
                result?.data?.items
                    ? [
                        ...result.data.items.map(({ id }) => ({ type: 'Country' as const, id })),
                        { type: 'Country', id: 'LIST' },
                    ]
                    : [{ type: 'Country', id: 'LIST' }],
        }),
        getCountriesLookup: builder.query<ApiResponse<LookupOption[]>, void>({
            query: () => ({
                url: '/api/v1/admin/lookups/countries',
            }),
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'Country' as const, id })),
                        { type: 'Country', id: 'LOOKUP' },
                    ]
                    : [{ type: 'Country', id: 'LOOKUP' }],
        }),

        getCountryById: builder.query<ApiResponse<Country>, number>({
            query: (id) => `/api/v1/admin/countries/${id}`,
            providesTags: (_result, _err, id) => [{ type: 'Country', id }],
        }),

        createCountry: builder.mutation<ApiResponse<Country>, CreateCountryRequest>({
            query: (body) => ({ url: '/api/v1/admin/countries', method: 'POST', body }),
            invalidatesTags: [{ type: 'Country', id: 'LIST' }],
        }),

        updateCountry: builder.mutation<ApiResponse<Country>, { id: number; body: UpdateCountryRequest }>({
            query: ({ id, body }) => ({ url: `/api/v1/admin/countries/${id}`, method: 'PUT', body }),
            invalidatesTags: (_result, _err, { id }) => [
                { type: 'Country', id },
                { type: 'Country', id: 'LIST' },
            ],
        }),

        deleteCountry: builder.mutation<ApiResponse<null>, number>({
            query: (id) => ({ url: `/api/v1/admin/countries/${id}`, method: 'DELETE' }),
            invalidatesTags: (_result, _err, id) => [
                { type: 'Country', id },
                { type: 'Country', id: 'LIST' },
            ],
        }),

    }),
});

export const {
    useGetCountriesQuery,
    useGetCountryByIdQuery,
    useCreateCountryMutation,
    useUpdateCountryMutation,
    useDeleteCountryMutation,
    useGetCountriesLookupQuery,
} = countriesApi;
