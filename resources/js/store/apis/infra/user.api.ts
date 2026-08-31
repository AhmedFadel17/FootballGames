import { mainApi } from '../mainApi';
import { ApiResponse, Lookup, PaginationFilter, PaginationResponse } from '@/types/api';
import { User, UserProgress, UserRole } from '@/types';
export interface UserProfilesFilter extends PaginationFilter {
    role?: UserRole;
}
export const userProfilesApi = mainApi.injectEndpoints({
    endpoints: (builder) => ({
        getUsersProfiles: builder.query<ApiResponse<PaginationResponse<User>>, UserProfilesFilter>({
            query: (filter) => {
                const params = new URLSearchParams();

                Object.entries(filter).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        params.append(key, value.toString());
                    }
                });

                return {
                    url: '/api/users',
                    params: params,
                };
            },
            providesTags: (result) =>
                result?.data?.items
                    ? [
                        ...result.data.items.map(({ id }) => ({ type: 'User' as const, id })),
                        { type: 'User', id: 'LIST' },
                    ]
                    : [{ type: 'User', id: 'LIST' }],
        }),

        getUserProfile: builder.query<ApiResponse<User>, void>({
            query: () => `/api/auth/me`,
            providesTags: ['User'],
        }),
        getMyProgress: builder.query<ApiResponse<UserProgress>, void>({
            query: () => `/api/auth/my-progress`,
            providesTags: ['User'],
        }),
        updateUserProfile: builder.mutation<ApiResponse<User>, Partial<User>>({
            query: (data) => ({
                url: `/api/user/profiles/me`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        updateUserProfilePicture: builder.mutation<ApiResponse<User>, FormData>({
            query: (data) => ({
                url: `/api/user/profiles/me/avatar`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        getProfile: builder.query<ApiResponse<User>, string>({
            query: (userId) => `/api/user/profiles/${userId}`,
            providesTags: ['User'],
        }),
        updateProfile: builder.mutation<ApiResponse<User>, { userId: string; data: Partial<User> }>({
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
    useGetMyProgressQuery,
    useUpdateUserProfileMutation,
    useUpdateUserProfilePictureMutation,
    useGetProfileQuery,
    useUpdateProfileMutation,
    useDeleteUserProfileMutation,
    useRestoreUserProfileMutation,
    useGetUsersLookupQuery
} = userProfilesApi;
