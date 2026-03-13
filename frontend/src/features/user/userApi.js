import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../utils/constants';

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        credentials: 'include',
    }),
    tagTypes: ['User'],
    endpoints: (builder) => ({
        // 1. Get Users by Role (Simple)
        getUsersByRole: builder.query({
            query: (role) => `/user/role-users?role=${role}`,
            providesTags: ['User'],
        }),

        // 2. Get All Users with filters
        getAllUsers: builder.query({
            query: (params) => ({
                url: '/user/all',
                params: params, // role, bootcampId, domainId, status
            }),
            providesTags: ['User'],
        }),

        // 3. Get Single User
        getUserById: builder.query({
            query: (id) => `/user/${id}`,
            providesTags: (result, error, id) => [{ type: 'User', id }],
        }),

        // 4. Update User
        updateUser: builder.mutation({
            query: ({ id, ...updatedUser }) => ({
                url: `/user/${id}`,
                method: 'PUT',
                body: updatedUser,
            }),
            invalidatesTags: ['User'],
        }),

        // 5. Delete User
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/user/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['User'],
        }),

        // 6. Get Profile
        getProfile: builder.query({
            query: () => '/user/profile',
            providesTags: ['User'],
        }),

        // 7. Update Self Profile
        updateProfile: builder.mutation({
            query: (userData) => ({
                url: '/user/update-profile',
                method: 'PUT',
                body: userData,
            }),
            invalidatesTags: ['User'],
        }),

        // 8. Change Password
        changePassword: builder.mutation({
            query: (passwordData) => ({
                url: '/auth/change-password',
                method: 'PUT',
                body: passwordData,
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const {
    useGetUsersByRoleQuery,
    useGetAllUsersQuery,
    useGetUserByIdQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useGetProfileQuery,
    useUpdateProfileMutation,
    useChangePasswordMutation,
} = userApi;
