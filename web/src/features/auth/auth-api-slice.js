import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
    reducerPath: 'auth-api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000/api/v1/auth',
        prepareHeaders(headers) {
            return headers;
        }
    }),
    endpoints(builder) {
        return {
            login: builder.mutation({ query: (credentials) => ({ url: '/login', method: 'POST', body: credentials }) })
        }
    }
});

export const { useLoginMutation } = apiSlice;