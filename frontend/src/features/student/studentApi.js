import { authApi } from '../auth/authServiceApi';

export const studentApi = authApi.injectEndpoints({
    endpoints: (builder) => ({
        // 1. Get Student Stats
        getStudentStats: builder.query({
            query: () => '/student-dashboard/stats',
            providesTags: ['Stats'],
        }),

        // 2. Get Student Assignments
        getStudentAssignments: builder.query({
            query: () => '/student-dashboard/assignments',
            providesTags: ['Assignment'],
        }),
    }),
});

export const {
    useGetStudentStatsQuery,
    useGetStudentAssignmentsQuery,
} = studentApi;
