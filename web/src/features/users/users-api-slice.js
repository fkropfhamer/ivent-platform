import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
    reducerPath: 'users-api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000/api/v1/users',
        prepareHeaders(headers) {
            return headers;
        }
    }),
    endpoints(builder) {
        return {
            registerUser: builder.mutation({ query: (credentials) => ({ url: '/register', method: 'POST', body: credentials }) })
        }
    }
});

export const { useRegisterUserMutation } = apiSlice;