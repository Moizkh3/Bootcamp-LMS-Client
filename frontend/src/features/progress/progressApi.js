import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../utils/constants';

export const progressApi = createApi({
    reducerPath: 'progressApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        credentials: 'include',
    }),
    tagTypes: ['Progress', 'StandupStatus'],
    endpoints: (builder) => ({
        submitStandup: builder.mutation({
            query: (data) => ({
                url: '/progress/submit',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Progress', 'StandupStatus'],
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
            invalidatesTags: ['Progress', 'StandupStatus'],
        }),
        reviewStandup: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/progress/review/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Progress', 'StandupStatus'],
        }),
        // 4. Check if today's standup is submitted
        getTodayStandupStatus: builder.query({
            query: () => '/student-dashboard/is-submit-today-standup',
            providesTags: ['StandupStatus'],
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