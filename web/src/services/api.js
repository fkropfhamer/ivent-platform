import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000/api/v1/',
        prepareHeaders(headers, { getState }) {
            const token = getState().auth.accessToken;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }

            return headers;
        }
    }),
    endpoints(builder) {
        return {
            login: builder.mutation({ query: (credentials) => ({ url: 'auth/login', method: 'POST', body: credentials }) }),
            fetchEvents: builder.query({ query: () => 'events' }),
            registerUser: builder.mutation({ query: (credentials) => ({ url: 'users/register', method: 'POST', body: credentials }) }),
            profile: builder.query({ query: () => 'auth/profile'}),
        }
    }
});


export const { useLoginMutation,  useFetchEventsQuery, useRegisterUserMutation, useProfileQuery } = apiSlice;