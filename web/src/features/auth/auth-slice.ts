import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type UserRole from '../../constants/roles'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  role: UserRole | null
  willRedirectToLogin: boolean
}

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
const refreshToken = window.localStorage.getItem('refresh-token') ? window.localStorage.getItem('refresh-token') : null

const initialState: AuthState = { accessToken: null, refreshToken, role: null, willRedirectToLogin: false }

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRole (state, action: PayloadAction<UserRole>) {
      state.role = action.payload
    },

    setToken (state, action: PayloadAction<string>) {
      state.accessToken = action.payload
    },

    setRefreshToken (state, action: PayloadAction<string>) {
      state.refreshToken = action.payload
      window.localStorage.setItem('refresh-token', action.payload)
    },

    unAuthenticate (state) {
      state.accessToken = null
      state.refreshToken = null
      state.role = null
    },

    authenticate (state, action: PayloadAction<{ accessToken: string, role: UserRole }>) {
      state.accessToken = action.payload.accessToken
      state.role = action.payload.role
    },

    logout (state) {
      state.accessToken = null
      state.refreshToken = null
      state.role = null
      state.willRedirectToLogin = true
      window.localStorage.setItem('refresh-token', '')
    },

    hasRedirectedToLogin (state) {
      state.willRedirectToLogin = false
    }
  }
})

export const { setToken, logout, setRefreshToken, setRole, hasRedirectedToLogin, unAuthenticate, authenticate } = authSlice.actions
export default authSlice.reducer
