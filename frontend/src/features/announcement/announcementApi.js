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
            invalidatesTags: ['Announcement']
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
