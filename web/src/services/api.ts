import { type BaseQueryFn, createApi, type FetchArgs, fetchBaseQuery, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { type RootState } from '../app/store'
import { logout, type Role, setToken } from '../features/auth/auth-slice'

interface Profile {
  username: string
  id: string
}

export interface Event {
  name: string
  id: string
}

export interface User {
  id: string
  name: string
  role: string
}

const baseUrl = import.meta.env.PROD ? '/api/' : 'http://localhost:8080/api/'

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders (headers, { getState }) {
    const token = (getState() as RootState).auth.accessToken
    if (token != null) {
      headers.set('authorization', `Bearer ${token}`)
    }

    return headers
  }
})

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions)

  const state = api.getState() as RootState

  if ((result.error != null) && result.error.status === 401) {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (state.auth.refreshToken) {
      const refreshResult = await baseQuery({
        url: 'auth/refresh',
        headers: { refresh: state.auth.refreshToken }
      }, api, extraOptions)
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (refreshResult.data) {
        const { token } = refreshResult.data as { token: string }
        api.dispatch(setToken(token))

        return await baseQuery(args, api, extraOptions)
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
  endpoints (builder) {
    return {
      login: builder.mutation<{ token: string, 'refresh-token': string, role: Role }, { username: string, password: string }>({
        query: (credentials) => ({
          url: 'auth/login',
          method: 'POST',
          body: credentials
        })
      }),
      event: builder.query<Event, string>({ query: (id) => `events/${id}` }),
      createEvent: builder.mutation({ query: (event) => ({ url: 'events', method: 'POST', body: event }) }),
      fetchEvents: builder.query<{ events: Event[], page: number, count: number }, number>({ query: (page) => `events?page=${page}` }),
      createUserByAdmin: builder.mutation({ query: (user) => ({ url: 'users/create', method: 'POST', body: user }) }),
      deleteUserByAdmin: builder.mutation<void, string>({
        query: (id) => ({
          url: `users/${id}`,
          method: 'DELETE'
        })
      }),
      changeUserRoleByAdmin: builder.mutation({ query: (change) => ({ url: 'users/change-role', method: 'PUT', body: change }) }),
      fetchUsers: builder.query<{ users: User[], page: number, count: number }, number>({ query: (page) => `users?page=${page}` }),
      registerUser: builder.mutation({
        query: (credentials) => ({
          url: 'users/register',
          method: 'POST',
          body: credentials
        })
      }),
      profile: builder.query<Profile, void>({ query: () => 'users/profile' }),
      deleteUser: builder.mutation<void, void>({ query: () => ({ url: 'users/profile', method: 'DELETE' }) }),
      changePassword: builder.mutation<void, { currentPassword: string, newPassword: string }>({
        query: (body) => ({
          url: 'users/change-password',
          method: 'POST',
          body
        })
      }),
      createServiceAccount: builder.mutation<{ token: string }, { name: string }>({ query: (body) => ({ url: 'users/service', method: 'POST', body }) }),
      markEvent: builder.mutation<void, string>({ query: (id) => ({ url: `events/${id}/mark`, method: 'PUT' }) }),
      unmarkEvent: builder.mutation<void, string>({ query: (id) => ({ url: `events/${id}/unmark`, method: 'PUT' }) }),
      fetchMarkedEvents: builder.query<{ events: Event[], page: number, total: number }, number>({ query: (page) => ({ url: 'events/marked', params: { page } }) })
    }
  }
})

export const {
  useLoginMutation,
  useFetchEventsQuery,
  useFetchUsersQuery,
  useRegisterUserMutation,
  useProfileQuery,
  useEventQuery,
  useCreateEventMutation,
  useCreateUserByAdminMutation,
  useDeleteUserMutation,
  useDeleteUserByAdminMutation,
  useChangeUserRoleByAdminMutation,
  useChangePasswordMutation,
  useCreateServiceAccountMutation,
  useMarkEventMutation,
  useFetchMarkedEventsQuery,
  useUnmarkEventMutation
} = apiSlice
