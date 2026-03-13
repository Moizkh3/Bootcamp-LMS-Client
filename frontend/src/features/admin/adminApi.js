import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../utils/constants';

export const adminApi = createApi({
    reducerPath: 'adminApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        credentials: 'include',
        prepareHeaders: (headers, { getState }) => {
            // Note: The backend uses cookies for auth, so credentials should be included.
            // But if we ever need to pass a token explicitly, we'd do it here.
            return headers;
        },
    }),
    tagTypes: ['Stats', 'Domains'],
    endpoints: (builder) => ({
        // 1. Get KPIs (Total Bootcamps, Students, Teachers, Active Assignments)
        getKpis: builder.query({
            query: () => '/admin-dashboard/kpis',
            providesTags: ['Stats'],
        }),

        // 2. Get Enrollment by Domains
        getEnrollmentByDomains: builder.query({
            query: () => '/admin-dashboard/enrollment-by-domains',
            providesTags: ['Domains'],
        }),
    }),
});

export const {
    useGetKpisQuery,
    useGetEnrollmentByDomainsQuery,
} = adminApi;
