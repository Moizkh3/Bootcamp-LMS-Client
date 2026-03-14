import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../utils/constants';

export const studentApi = createApi({
    reducerPath: 'studentApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/student-dashboard`,
        credentials: 'include',
    }),
    tagTypes: ['StudentStats', 'StudentAssignments'],
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
    }),
});

export const {
    useGetStudentStatsQuery,
    useGetStudentAssignmentsQuery,
} = studentApi;
