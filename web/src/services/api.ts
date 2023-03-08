import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../app/store';

interface Profile {
    username: string,
    id: string,
}

interface Event {
    name: string,
    id: string
}

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8080/api/',
        prepareHeaders(headers, { getState }) {
            const token = (getState() as RootState).auth.accessToken;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }

            return headers;
        }
    }),
    endpoints(builder) {
        return {
            login: builder.mutation({ query: (credentials) => ({ url: 'auth/login', method: 'POST', body: credentials }) }),
            event: builder.query<Event, string>({ query: (id) => `events/${id}`}),
            fetchEvents: builder.query<[Event], void>({ query: () => 'events', transformResponse: (response: { events: [Event]}) => response.events }),
            registerUser: builder.mutation({ query: (credentials) => ({ url: 'users/register', method: 'POST', body: credentials }) }),
            profile: builder.query<Profile, void>({ query: () => 'users/profile'}),
        }
    }
});


export const { useLoginMutation,  useFetchEventsQuery, useRegisterUserMutation, useProfileQuery, useEventQuery } = apiSlice;