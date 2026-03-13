import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../utils/constants';

export const teacherApi = createApi({
    reducerPath: 'teacherApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/teacher`,
        credentials: 'include',
    }),
    tagTypes: ['TeacherStats', 'TeacherAssignment', 'TeacherSubmission'],
    endpoints: (builder) => ({
        // 1. Get Teacher Stats
        getTeacherStats: builder.query({
            query: () => '/stats',
            providesTags: ['TeacherStats'],
        }),

        // 2. Get All Assignments
        getTeacherAssignments: builder.query({
            query: () => '/get-assignments',
            providesTags: ['TeacherAssignment'],
        }),

        // 3. Create Assignment
        createTeacherAssignment: builder.mutation({
            query: (formData) => ({
                url: '/create-assignment',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['TeacherAssignment', 'TeacherStats'],
        }),

        // 4. Update Assignment
        updateTeacherAssignment: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/update-assignment/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['TeacherAssignment', 'TeacherStats'],
        }),

        // 5. Delete Assignment
        deleteTeacherAssignment: builder.mutation({
            query: (id) => ({
                url: `/delete-assignment/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['TeacherAssignment', 'TeacherStats'],
        }),

        // 6. Review Submission
        reviewSubmission: builder.mutation({
            query: ({ submissionId, ...reviewData }) => ({
                url: `/review-submission/${submissionId}`,
                method: 'POST',
                body: reviewData,
            }),
            invalidatesTags: ['TeacherSubmission', 'TeacherStats'],
        }),

        // 7. Get Submissions for an assignment
        getAssignmentSubmissions: builder.query({
            query: (assignmentId) => `/get-assignment-submissions/${assignmentId}`,
            providesTags: ['TeacherSubmission'],
        }),

        // 8. Get All Submissions for teacher
        getTeacherSubmissions: builder.query({
            query: () => '/get-submissions',
            providesTags: ['TeacherSubmission'],
        }),

        // 9. Get Specific Submission
        getSubmissionById: builder.query({
            query: (id) => `/get-submission/${id}`,
            providesTags: ['TeacherSubmission'],
        }),
        getTeacherStudents: builder.query({
            query: () => '/students',
            providesTags: ['TeacherSubmission'], // Reusing submission tag or could add 'TeacherStudent'
        }),
        getStudentProgress: builder.query({
            query: (studentId) => `/student-progress/${studentId}`,
            providesTags: ['TeacherSubmission'],
        }),
        giveStandupFeedback: builder.mutation({
            query: ({ standupId, ...data }) => ({
                url: `/standup-feedback/${standupId}`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['TeacherSubmission', 'TeacherStats'],
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