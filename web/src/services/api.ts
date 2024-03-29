import { type BaseQueryFn, createApi, type FetchArgs, fetchBaseQuery, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { type RootState } from '../app/store'
import { authenticate, logout } from '../features/auth/auth-slice'
import type UserRole from '../constants/roles'

interface Profile {
  username: string
  id: string
}

export interface Event {
  id: string
  name: string
  description: string
  start: string
  end: string
  identifier: string
  location: string
  price_info: string
  organizer: string
  link: string
  creator: string
  is_marked: boolean
}

export interface User {
  id: string
  name: string
  role: string
}

enum TagType {
  Events = 'Events'
}

const ListID = 'LIST'

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

export const authApiSlice = createApi({
  reducerPath: 'api/auth',
  baseQuery,
  endpoints (builder) {
    return {
      getRefreshToken: builder.query<{ token: string, role: UserRole }, string>({ query: (refreshToken) => ({ url: 'auth/refresh', headers: { Refresh: refreshToken }, method: 'GET' }) })
    }
  }
})

export const { useGetRefreshTokenQuery } = authApiSlice

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions)
  const state = api.getState() as RootState

  if ((result.error != null) && result.error.status === 401) {
    if (state.auth.refreshToken != null) {
      const refreshResult = await api.dispatch(authApiSlice.endpoints.getRefreshToken.initiate(state.auth.refreshToken))
      if (refreshResult.data != null && refreshResult.error == null) {
        const { token, role } = refreshResult.data
        api.dispatch(authenticate({ accessToken: token, role }))

        return await baseQuery(args, api, extraOptions)
      }
    }

    api.dispatch(logout())
  }

  return result
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [TagType.Events],
  endpoints (builder) {
    return {
      login: builder.mutation<{ token: string, 'refresh-token': string, role: UserRole }, { username: string, password: string }>({
        query: (credentials) => ({
          url: 'auth/login',
          method: 'POST',
          body: credentials
        })
      }),
      event: builder.query<Event, string>({ query: (id) => `events/${id}` }),
      createEvent: builder.mutation({ query: (event) => ({ url: 'events', method: 'POST', body: event }) }),
      fetchEvents: builder.query<{ events: Event[], page: number, count: number }, { page: number, marked: string | undefined }>({
        query: (params) => ({ url: 'events', params: { ...params } }),
        providesTags: (result) => {
          if (result != null) {
            return [
              ...result.events.map(({ id }) => ({ type: TagType.Events as const, id })),
              { type: TagType.Events, id: ListID }
            ]
          }
          return [{ type: TagType.Events, id: ListID }]
        }
      }),
      createUserByAdmin: builder.mutation({ query: (user) => ({ url: 'users/create', method: 'POST', body: user }) }),
      deleteUserByAdmin: builder.mutation<void, string>({
        query: (id) => ({
          url: `users/${id}`,
          method: 'DELETE'
        })
      }),
      changeUserRoleByAdmin: builder.mutation({ query: (change) => ({ url: 'users/change-role', method: 'PUT', body: change }) }),
      fetchUsers: builder.query<{ users: User[], page: number, count: number }, { page: number, role: UserRole | undefined }>({
        query: (params) => ({ url: 'users', params: { ...params } })
      }),
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
      markEvent: builder.mutation<void, string>({ query: (id) => ({ url: `events/${id}/mark`, method: 'PUT' }), invalidatesTags: (_result, _error, _arg) => [{ type: TagType.Events, id: ListID }] }),
      unmarkEvent: builder.mutation<void, string>({ query: (id) => ({ url: `events/${id}/unmark`, method: 'PUT' }), invalidatesTags: (_result, _error, _arg) => [{ type: TagType.Events, id: ListID }] })
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
  useUnmarkEventMutation
} = apiSlice
