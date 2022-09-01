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
            fetchEvents: builder.query({ query: () => '/events' })
        }
    }
});

export const { useFetchEventsQuery } = apiSlice;