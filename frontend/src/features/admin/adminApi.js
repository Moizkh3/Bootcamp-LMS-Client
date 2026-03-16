import { authApi } from '../auth/authServiceApi';

export const adminApi = authApi.injectEndpoints({
    endpoints: (builder) => ({
        // 1. Get KPIs (Total Bootcamps, Students, Teachers, Active Assignments)
        getKpis: builder.query({
            query: () => '/admin-dashboard/kpis',
            providesTags: ['Stats'],
        }),

        // 2. Get Enrollment by Domains
        getEnrollmentByDomains: builder.query({
            query: () => '/admin-dashboard/enrollment-by-domains',
            providesTags: ['Domain'],
        }),
    }),
});

export const {
    useGetKpisQuery,
    useGetEnrollmentByDomainsQuery,
} = adminApi;
