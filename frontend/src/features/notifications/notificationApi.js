import { authApi } from '../auth/authServiceApi';

export const notificationApi = authApi.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query({
            query: (params) => {
                const { page = 1, limit = 15 } = params || {};
                return `/notifications?page=${page}&limit=${limit}`;
            },
            providesTags: ['Notification'],
        }),
        markNotificationsRead: builder.mutation({
            query: () => ({
                url: '/notifications/mark-read',
                method: 'PUT',
            }),
            invalidatesTags: ['Notification'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    notificationApi.util.updateQueryData('getNotifications', {}, (draft) => {
                        if (draft?.notifications) {
                            draft.notifications.forEach(n => n.read = true);
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useMarkNotificationsReadMutation,
} = notificationApi;
