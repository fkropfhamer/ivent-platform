import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000/api/v1/',
        prepareHeaders(headers) {
            return headers;
        }
    }),
    endpoints(builder) {
        return {
            login: builder.mutation({ query: (credentials) => ({ url: 'auth/login', method: 'POST', body: credentials }) }),

            fetchEvents: builder.query({ query: () => 'events' }),

            registerUser: builder.mutation({ query: (credentials) => ({ url: 'users/register', method: 'POST', body: credentials }) }),
        }
    }
});


export const { useLoginMutation,  useFetchEventsQuery, useRegisterUserMutation } = apiSlice;