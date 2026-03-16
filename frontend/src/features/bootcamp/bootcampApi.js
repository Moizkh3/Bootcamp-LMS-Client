import { authApi } from '../auth/authServiceApi';

export const bootcampApi = authApi.injectEndpoints({
    endpoints: (builder) => ({
        // 1. Get All Bootcamps
        getAllBootcamps: builder.query({
            query: (params) => ({
                url: '/bootcamp/all',
                params: params, // status, search
            }),
            providesTags: ['Bootcamp'],
        }),

        // 2. Create Bootcamp
        createBootcamp: builder.mutation({
            query: (newBootcamp) => ({
                url: '/bootcamp/create',
                method: 'POST',
                body: newBootcamp,
            }),
            invalidatesTags: ['Bootcamp', 'Stats'],
        }),

        // 3. Edit Bootcamp
        editBootcamp: builder.mutation({
            query: ({ id, ...updatedBootcamp }) => ({
                url: `/bootcamp/edit/${id}`,
                method: 'PUT',
                body: updatedBootcamp,
            }),
            invalidatesTags: ['Bootcamp', 'User'],
        }),

        // 4. Delete Bootcamp
        deleteBootcamp: builder.mutation({
            query: (id) => ({
                url: `/bootcamp/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Bootcamp'],
        }),

        // 5. Get Bootcamp by ID
        getBootcampById: builder.query({
            query: (id) => `/bootcamp/${id}`,
            providesTags: (result, error, id) => [{ type: 'Bootcamp', id }],
        }),
    }),
});

export const {
    useGetAllBootcampsQuery,
    useCreateBootcampMutation,
    useEditBootcampMutation,
    useDeleteBootcampMutation,
    useGetBootcampByIdQuery,
} = bootcampApi;
