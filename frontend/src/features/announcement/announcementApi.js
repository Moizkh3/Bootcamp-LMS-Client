import { authApi } from "../auth/authServiceApi";

export const announcementApi = authApi.injectEndpoints({
    endpoints: (builder) => ({
        getAnnouncements: builder.query({
            query: (params) => ({
                url: '/announcement/all',
                params
            }),
            providesTags: ['Announcement']
        }),
        createAnnouncement: builder.mutation({
            query: (data) => ({
                url: '/announcement/create',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Announcement'],
            async onQueryStarted(data, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    announcementApi.util.updateQueryData('getAnnouncements', undefined, (draft) => {
                        // Assuming the API returns a similar structure
                        // We add a temporary item or just let it refresh, 
                        // but for optimistic UI let's add it if we know the structure.
                        // Since many components use getAnnouncements with params (role, etc), 
                        // optimistic logic is harder without knowing params.
                        // However, we can at least ensure we invalidate properly.
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),
        deleteAnnouncement: builder.mutation({
            query: (id) => ({
                url: `/announcement/delete/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Announcement']
        })
    })
});

export const {
    useGetAnnouncementsQuery,
    useCreateAnnouncementMutation,
    useDeleteAnnouncementMutation
} = announcementApi;
