import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { RootState } from '../app/store';
import { logout, setToken } from '../features/auth/auth-slice';

interface Profile {
    username: string,
    id: string,
}

export interface Event {
    name: string,
    id: string
}

export interface User {
    id: string,
    name: string,
    role: string
}

const baseUrl = import.meta.env.PROD ? '/api/' : 'http://localhost:8080/api/'

const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders(headers, { getState }) {
        const token = (getState() as RootState).auth.accessToken;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }

        return headers;
    }
})

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    const state = api.getState() as RootState

    if (result.error && result.error.status === 401) {
        if (state.auth.refreshToken) {
            const refreshResult = await baseQuery({ url: 'auth/refresh', headers: { refresh: state.auth.refreshToken } }, api, extraOptions)
            if (refreshResult.data) {
                const { token } = refreshResult.data as { token: string }
                api.dispatch(setToken(token))

                return baseQuery(args, api, extraOptions)
            }
        }

        api.dispatch(logout())
        window.location.href = '/login'  
    }


    return result
}

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    endpoints(builder) {
        return {
            login: builder.mutation<{ token: string, "refresh-token": string }, { username: string, password: string }>({ query: (credentials) => ({ url: 'auth/login', method: 'POST', body: credentials }) }),
            event: builder.query<Event, string>({ query: (id) => `events/${id}` }),
            createEvent: builder.mutation({ query: (event) => ({ url: 'events', method: 'POST', body: event }) }),
            fetchEvents: builder.query<{events: [Event], page: number, count: number }, number>({ query: (page) => `events?page=${page}` }),
            fetchUsers: builder.query<{users: [User], page: number, count: number }, number>({ query: (page) => `users?page=${page}` }),
            registerUser: builder.mutation({ query: (credentials) => ({ url: 'users/register', method: 'POST', body: credentials }) }),
            profile: builder.query<Profile, void>({ query: () => 'users/profile' }),
            deleteAccount: builder.mutation<void, void>({query: () => ({url: 'users/profile', method: 'DELETE' })}),
            changePassword: builder.mutation<void, { currentPassword: string, newPassword: string}>({query: (body) => ({ url: 'users/change-password', method: 'POST', body }) })
        }
    }
});


export const { useLoginMutation, useFetchEventsQuery, useFetchUsersQuery, useRegisterUserMutation, useProfileQuery, useEventQuery, useCreateEventMutation, useDeleteAccountMutation, useChangePasswordMutation } = apiSlice;