import { authApi } from '../auth/authServiceApi';

export const progressApi = authApi.injectEndpoints({
    endpoints: (builder) => ({
        submitStandup: builder.mutation({
            query: (data) => ({
                url: '/progress/submit',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Progress', 'Stats'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    progressApi.util.updateQueryData('getTodayStandupStatus', undefined, (draft) => {
                        // Optimistically set today's status to submitted
                        return { isSubmitted: true };
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),
        getStudentProgress: builder.query({
            query: () => '/progress/my-progress',
            providesTags: ['Progress'],
        }),
        getBootcampProgress: builder.query({
            query: (bootcampId) => `/progress/bootcamp/${bootcampId}`,
            providesTags: ['Progress'],
        }),
        updateStandup: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/progress/update/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Progress'],
        }),
        reviewStandup: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/progress/review/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Progress', 'Stats'],
        }),
        // 4. Check if today's standup is submitted
        getTodayStandupStatus: builder.query({
            query: () => '/student-dashboard/is-submit-today-standup',
            providesTags: ['Progress'],
        }),
    }),
});

export const {
    useSubmitStandupMutation,
    useUpdateStandupMutation,
    useGetStudentProgressQuery,
    useGetBootcampProgressQuery,
    useReviewStandupMutation,
    useGetTodayStandupStatusQuery,
} = progressApi;