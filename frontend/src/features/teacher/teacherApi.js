import { authApi } from '../auth/authServiceApi';

export const teacherApi = authApi.injectEndpoints({
    endpoints: (builder) => ({
        // 1. Get Teacher Stats
        getTeacherStats: builder.query({
            query: () => '/teacher/stats',
            providesTags: ['Stats'],
        }),

        // 2. Get All Assignments
        getTeacherAssignments: builder.query({
            query: () => '/teacher/get-assignments',
            providesTags: ['Assignment'],
        }),

        // 3. Create Assignment
        createTeacherAssignment: builder.mutation({
            query: (formData) => ({
                url: '/teacher/create-assignment',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Assignment', 'Stats'],
        }),

        // 4. Update Assignment
        updateTeacherAssignment: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/teacher/update-assignment/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Assignment', 'Stats'],
        }),

        // 5. Delete Assignment
        deleteTeacherAssignment: builder.mutation({
            query: (id) => ({
                url: `/teacher/delete-assignment/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Assignment', 'Stats'],
        }),

        // 6. Review Submission
        reviewSubmission: builder.mutation({
            query: ({ submissionId, ...reviewData }) => ({
                url: `/teacher/review-submission/${submissionId}`,
                method: 'POST',
                body: reviewData,
            }),
            invalidatesTags: ['Submission', 'Stats', 'Assignment'],
        }),

        // 7. Get Submissions for an assignment
        getAssignmentSubmissions: builder.query({
            query: (assignmentId) => `/teacher/get-assignment-submissions/${assignmentId}`,
            providesTags: ['Submission'],
        }),

        // 8. Get All Submissions for teacher
        getTeacherSubmissions: builder.query({
            query: () => '/teacher/get-submissions',
            providesTags: ['Submission'],
        }),

        // 9. Get Specific Submission
        getSubmissionById: builder.query({
            query: (id) => `/teacher/get-submission/${id}`,
            providesTags: ['Submission'],
        }),
        getTeacherStudents: builder.query({
            query: () => '/teacher/students',
            providesTags: ['User'],
        }),
        getStudentProgress: builder.query({
            query: (studentId) => `/teacher/student-progress/${studentId}`,
            providesTags: ['Progress'],
        }),
        giveStandupFeedback: builder.mutation({
            query: ({ standupId, ...data }) => ({
                url: `/teacher/standup-feedback/${standupId}`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Progress', 'Stats', 'User'],
        }),
    }),
});

export const {
    useGetTeacherStatsQuery,
    useGetTeacherAssignmentsQuery,
    useCreateTeacherAssignmentMutation,
    useUpdateTeacherAssignmentMutation,
    useDeleteTeacherAssignmentMutation,
    useReviewSubmissionMutation,
    useGetAssignmentSubmissionsQuery,
    useGetTeacherSubmissionsQuery,
    useGetSubmissionByIdQuery,
    useGetTeacherStudentsQuery,
    useGetStudentProgressQuery,
    useGiveStandupFeedbackMutation,
} = teacherApi;