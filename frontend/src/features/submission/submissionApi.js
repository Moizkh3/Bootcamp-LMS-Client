import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../utils/constants';

export const submissionApi = createApi({
    reducerPath: 'submissionApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        credentials: 'include',
    }),
    tagTypes: ['Submissions'],
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
            invalidatesTags: ['Submissions'],
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
            providesTags: ['Submissions'],
        }),
        getSubmissionByAssignment: builder.query({
            query: (assignmentId) => ({
                url: '/submission',
                params: { assignment: assignmentId }
            }),
            providesTags: ['Submissions'],
        }),
    }),
});

export const {
    useSubmitAssignmentMutation,
    useGetAllSubmissionsQuery,
    useGetSubmissionByAssignmentQuery,
} = submissionApi;