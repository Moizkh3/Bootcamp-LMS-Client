import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../utils/constants';

export const notificationApi = createApi({
    reducerPath: 'notificationApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        credentials: 'include',
    }),
    tagTypes: ['Notifications'],
    endpoints: (builder) => ({
        getNotifications: builder.query({
            query: (params) => {
                const { page = 1, limit = 15 } = params || {};
                return `/notifications?page=${page}&limit=${limit}`;
            },
            providesTags: ['Notifications'],
        }),
        markNotificationsRead: builder.mutation({
            query: () => ({
                url: '/notifications/mark-read',
                method: 'PUT',
            }),
            invalidatesTags: ['Notifications'],
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useMarkNotificationsReadMutation,
} = notificationApi;
