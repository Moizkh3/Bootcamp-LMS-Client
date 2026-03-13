import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../utils/constants';

export const studentApi = createApi({
    reducerPath: 'studentApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/student-dashboard`,
        credentials: 'include',
    }),
    tagTypes: ['StudentStats', 'StudentAssignments', 'StandupStatus'],
    endpoints: (builder) => ({
        // 1. Get Student Stats
        getStudentStats: builder.query({
            query: () => '/stats',
            providesTags: ['StudentStats'],
        }),

        // 2. Get Student Assignments
        getStudentAssignments: builder.query({
            query: () => '/assignments',
            providesTags: ['StudentAssignments'],
        }),

        // 3. Check if today's standup is submitted
        getTodayStandupStatus: builder.query({
            query: () => '/is-submit-today-standup',
            providesTags: ['StandupStatus'],
        }),
    }),
});

export const {
    useGetStudentStatsQuery,
    useGetStudentAssignmentsQuery,
    useGetTodayStandupStatusQuery,
} = studentApi;
