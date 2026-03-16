import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../utils/constants';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        credentials: 'include',
    }),

    tagTypes: ['Auth', 'Profile', 'User', 'Bootcamp', 'Domain', 'Assignment', 'Submission', 'Progress', 'Notification', 'Announcement', 'Stats'],

    endpoints: (builder) => ({
        // 1. Login
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Profile', 'Auth'],
        }),

        // 2. Forgot Password
        forgotPassword: builder.mutation({
            query: (email) => ({
                url: '/auth/getVerificationEmailForForgetPassword',
                method: 'POST',
                body: { email },
            }),
        }),

        // 3. Verify OTP & Set New Password
        verifyOtp: builder.mutation({
            query: (data) => ({
                url: '/auth/verifyOtp',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Auth'],
        }),

        // 4. Change Password
        changePassword: builder.mutation({
            query: (data) => ({
                url: '/auth/change-password',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Auth'],
        }),

        // 6. Register User
        register: builder.mutation({
            query: (userData) => ({
                url: '/auth/register',
                method: 'POST',
                body: userData,
            }),
            invalidatesTags: ['Auth', 'User', 'Stats'],
        }),

        // 7. Logout
        logoutUser: builder.query({
            query: () => ({
                url: '/auth/logout',
                method: 'GET',
            }),
            invalidatesTags: ['Profile', 'Auth'],
        }),

        // 8. Get Profile
        getProfile: builder.query({
            query: () => ({
                url: '/auth/get-profile',
                method: 'GET',
            }),
            providesTags: ['Profile'],
        }),

        // 9. Bulk Register Students
        bulkRegister: builder.mutation({
            query: (formData) => ({
                url: '/auth/bulk-register',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Auth', 'User', 'Stats'],
        }),
    }),
});

export const {
    useLoginMutation,
    useForgotPasswordMutation,
    useVerifyOtpMutation,
    useChangePasswordMutation,
    useLazyLogoutUserQuery,
    useRegisterMutation,
    useGetProfileQuery,
    useBulkRegisterMutation,
} = authApi;
