import { authApi } from "../auth/authServiceApi";

export const assignmentApi = authApi.injectEndpoints({
    endpoints: (builder) => ({
        getAssignments: builder.query({
            query: (params) => ({
                url: '/teacher/get-assignments',
                params
            }),
            providesTags: ['Assignment']
        }),
        getAssignmentsByBootcamp: builder.query({
            query: (bootcampId) => `/teacher/get-assignments?bootcampId=${bootcampId}`,
            providesTags: ['Assignment']
        }),
        createAssignment: builder.mutation({
            query: (formData) => ({
                url: '/teacher/create-assignment',
                method: 'POST',
                body: formData
            }),
            invalidatesTags: ['Assignment']
        }),
        updateAssignment: builder.mutation({
            query: ({ id, data }) => ({
                url: `/teacher/update-assignment/${id}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['Assignment']
        }),
        deleteAssignment: builder.mutation({
            query: (id) => ({
                url: `/teacher/delete-assignment/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Assignment']
        }),
        getAssignmentById: builder.query({
            query: (id) => `/student-dashboard/assignment/${id}`,
            providesTags: (result, error, id) => [{ type: 'Assignment', id }]
        })
    })
});

export const {
    useGetAssignmentsQuery,
    useGetAssignmentsByBootcampQuery,
    useCreateAssignmentMutation,
    useUpdateAssignmentMutation,
    useDeleteAssignmentMutation,
    useGetAssignmentByIdQuery
} = assignmentApi;
