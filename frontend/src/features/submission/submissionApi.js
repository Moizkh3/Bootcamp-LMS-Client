import { authApi } from '../auth/authServiceApi';

export const submissionApi = authApi.injectEndpoints({
    endpoints: (builder) => ({
        submitAssignment: builder.mutation({
            query: (data) => {
                const formData = new FormData();
                if (data.referenceFile) formData.append('referenceFile', data.referenceFile);
                if (data.frontendGithubUrl) formData.append('frontendGithubUrl', data.frontendGithubUrl);
                if (data.backendGithubUrl) formData.append('backendGithubUrl', data.backendGithubUrl);
                if (data.deployedUrl) formData.append('deployedUrl', data.deployedUrl);
                if (data.behanceUrl) formData.append('behanceUrl', data.behanceUrl);
                if (data.figmaUrl) formData.append('figmaUrl', data.figmaUrl);
                if (data.referenceFile) formData.append('referenceFile', data.referenceFile);
                if (data.note) formData.append('note', data.note);
                if (data.assignmentId) formData.append('assignment', data.assignmentId);

                return {
                    url: '/submission/submit-assignment',
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: ['Submission', 'Stats', 'Assignment'],
        }),
        getAllSubmissions: builder.query({
            query: (params = {}) => {
                const { page = 1, limit = 10, ...rest } = params;
                let queryString = `?page=${page}&limit=${limit}`;
                Object.keys(rest).forEach(key => {
                    if (rest[key]) queryString += `&${key}=${rest[key]}`;
                });
                return `/submission${queryString}`;
            },
            providesTags: ['Submission'],
        }),
        getSubmissionByAssignment: builder.query({
            query: (assignmentId) => ({
                url: '/submission',
                params: { assignment: assignmentId }
            }),
            providesTags: ['Submission'],
        }),
    }),
});

export const {
    useSubmitAssignmentMutation,
    useGetAllSubmissionsQuery,
    useGetSubmissionByAssignmentQuery,
} = submissionApi;