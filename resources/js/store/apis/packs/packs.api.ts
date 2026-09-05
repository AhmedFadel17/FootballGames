import { mainApi, API_URL } from './../mainApi';
import { ApiResponse, PaginationResponse, PaginationFilter, LookupOption } from '@/types';
import { Pack, PackOpeningResult, Powerup, Cosmetic, UserPlayerCard, UserInventoryPowerup, UserInventoryCosmetic, SquadLineup } from '@/types';

const BASE_URL = `${API_URL}/packs`;

export interface CreatePackRequest {
    name: string;
    slug: string;
    description?: string;
    img_src?: string;
    price_coins: number;
    cards_count: number;
    required_level?: number;
    user_limit?: number | null;
    limit_type?: number;
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
            query: (body) => ({ url: `${API_URL}/store/open-pack`, method: 'POST', body }),
            invalidatesTags: [
                { type: 'Pack', id: 'LIST' },
                'User',
                { type: 'UserInventory' as const, id: 'CARDS' },
                { type: 'UserInventory' as const, id: 'POWERUPS' },
                { type: 'UserInventory' as const, id: 'COSMETICS' },
            ],
        }),

        // ── User Store Endpoints ──
        getUserStorePacks: builder.query<ApiResponse<Pack[]>, void>({
            query: () => `${API_URL}/store/packs`,
            providesTags: [{ type: 'Pack', id: 'STORE' }],
        }),

        getUserStorePowerups: builder.query<ApiResponse<Powerup[]>, void>({
            query: () => `${API_URL}/store/powerups`,
        }),

        getUserStoreCosmetics: builder.query<ApiResponse<Cosmetic[]>, void>({
            query: () => `${API_URL}/store/cosmetics`,
        }),

        // ── User Inventory & My Team Endpoints ──
        getUserMyCards: builder.query<ApiResponse<UserPlayerCard[]>, void>({
            query: () => `${API_URL}/my-team/cards`,
            providesTags: [{ type: 'UserInventory' as const, id: 'CARDS' }],
        }),

        getUserMyPowerups: builder.query<ApiResponse<UserInventoryPowerup[]>, void>({
            query: () => `${API_URL}/my-team/powerups`,
            providesTags: [{ type: 'UserInventory' as const, id: 'POWERUPS' }],
        }),

        getUserMyCosmetics: builder.query<ApiResponse<UserInventoryCosmetic[]>, void>({
            query: () => `${API_URL}/my-team/cosmetics`,
            providesTags: [{ type: 'UserInventory' as const, id: 'COSMETICS' }],
        }),

        getSquadLineup: builder.query<ApiResponse<SquadLineup | null>, void>({
            query: () => `${API_URL}/my-team/lineup`,
            providesTags: [{ type: 'UserInventory' as const, id: 'LINEUP' }],
        }),

        saveSquadLineup: builder.mutation<ApiResponse<SquadLineup>, SquadLineup>({
            query: (body) => ({ url: `${API_URL}/my-team/lineup`, method: 'POST', body }),
            invalidatesTags: [{ type: 'UserInventory' as const, id: 'LINEUP' }],
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
    useGetUserStorePacksQuery,
    useGetUserStorePowerupsQuery,
    useGetUserStoreCosmeticsQuery,
    useGetUserMyCardsQuery,
    useGetUserMyPowerupsQuery,
    useGetUserMyCosmeticsQuery,
    useGetSquadLineupQuery,
    useSaveSquadLineupMutation,
} = packsApi;