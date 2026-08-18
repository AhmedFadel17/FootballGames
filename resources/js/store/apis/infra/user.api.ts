import { SubscriptionStatus, UserRole } from '@/types';
import { mainApi } from '../mainApi';
import { ApiResponse, Lookup, PaginationFilter, PaginationResponse } from '@/types/api';
import { UserProfile } from '@/types/models/infra';
export interface UserProfilesFilter extends PaginationFilter {
    role?: UserRole;
    subscriptionStatus?: SubscriptionStatus;
}
export const userProfilesApi = mainApi.injectEndpoints({
    endpoints: (builder) => ({
        getUsersProfiles: builder.query<ApiResponse<PaginationResponse<UserProfile>>, UserProfilesFilter>({
            query: (filter) => {
                const params = new URLSearchParams();

                Object.entries(filter).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        params.append(key, value.toString());
                    }
                });

                return {
                    url: '/api/user/profiles',
                    params: params,
                };
            },
            providesTags: (result) =>
                result?.data?.items
                    ? [
                        ...result.data.items.map(({ userId }) => ({ type: 'User' as const, id: userId })),
                        { type: 'User', id: 'LIST' },
                    ]
                    : [{ type: 'User', id: 'LIST' }],
        }),

        getUserProfile: builder.query<ApiResponse<UserProfile>, void>({
            query: () => `/api/user/profiles/me`,
            providesTags: ['User'],
        }),
        updateUserProfile: builder.mutation<ApiResponse<UserProfile>, Partial<UserProfile>>({
            query: (data) => ({
                url: `/api/user/profiles/me`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        updateUserProfilePicture: builder.mutation<ApiResponse<UserProfile>, FormData>({
            query: (data) => ({
                url: `/api/user/profiles/me/avatar`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        getProfile: builder.query<ApiResponse<UserProfile>, string>({
            query: (userId) => `/api/user/profiles/${userId}`,
            providesTags: ['User'],
        }),
        updateProfile: builder.mutation<ApiResponse<UserProfile>, { userId: string; data: Partial<UserProfile> }>({
            query: ({ userId, data }) => ({
                url: `/api/user/profiles/${userId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        deleteUserProfile: builder.mutation<ApiResponse<null>, string>({
            query: (userId) => ({ url: `/api/user/profiles/${userId}`, method: 'DELETE' }),
            invalidatesTags: (_result, _err, id) => [
                { type: 'User', id },
                { type: 'User', id: 'LIST' },
            ],
        }),
        restoreUserProfile: builder.mutation<ApiResponse<null>, string>({
            query: (userId) => ({ url: `/api/user/profiles/${userId}/restore`, method: 'PUT' }),
            invalidatesTags: (_result, _err, id) => [
                { type: 'User', id },
                { type: 'User', id: 'LIST' },
            ],
        }),
        getUsersLookup: builder.query<ApiResponse<Lookup[]>, void>({
            query: () => ({
                url: '/api/user/profiles/lookup',
            }),
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'User' as const, id })),
                        { type: 'User', id: 'LOOKUP' },
                    ]
                    : [{ type: 'User', id: 'LOOKUP' }],
        }),
    }),
});

export const {
    useGetUsersProfilesQuery,
    useGetUserProfileQuery,
    useUpdateUserProfileMutation,
    useUpdateUserProfilePictureMutation,
    useGetProfileQuery,
    useUpdateProfileMutation,
    useDeleteUserProfileMutation,
    useRestoreUserProfileMutation,
    useGetUsersLookupQuery
} = userProfilesApi;
