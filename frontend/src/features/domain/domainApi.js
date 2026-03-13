import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../utils/constants';

export const domainApi = createApi({
    reducerPath: 'domainApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        credentials: 'include',
    }),
    tagTypes: ['Domain'],
    endpoints: (builder) => ({
        // 1. Get All Domains
        getAllDomains: builder.query({
            query: () => '/domain/all',
            providesTags: ['Domain'],
        }),

        // 2. Add Domain
        addDomain: builder.mutation({
            query: (newDomain) => ({
                url: '/domain/add',
                method: 'POST',
                body: newDomain,
            }),
            invalidatesTags: ['Domain'],
        }),

        // 3. Edit Domain
        editDomain: builder.mutation({
            query: ({ id, ...updatedDomain }) => ({
                url: `/domain/edit/${id}`,
                method: 'PUT',
                body: updatedDomain,
            }),
            invalidatesTags: ['Domain'],
        }),

        // 4. Get Domain by ID
        getDomainById: builder.query({
            query: (id) => `/domain/get/${id}`,
            providesTags: (result, error, id) => [{ type: 'Domain', id }],
        }),

        // 5. Delete Domain
        deleteDomain: builder.mutation({
            query: (id) => ({
                url: `/domain/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Domain'],
        }),
    }),
});

export const {
    useGetAllDomainsQuery,
    useAddDomainMutation,
    useEditDomainMutation,
    useGetDomainByIdQuery,
    useDeleteDomainMutation,
} = domainApi;
