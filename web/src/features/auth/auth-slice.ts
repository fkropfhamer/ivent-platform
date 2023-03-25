import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  role: Role | null
}

export enum Role {
  Admin = 'ROLE_ADMIN',
  User = 'ROLE_USER',
}

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
const refreshToken = window.localStorage.getItem('refresh-token') ? window.localStorage.getItem('refresh-token') : null

const initialState: AuthState = { accessToken: null, refreshToken, role: null }

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRole (state, action: PayloadAction<Role>) {
      state.role = action.payload
    },

    setToken (state, action: PayloadAction<string>) {
      state.accessToken = action.payload
    },

    setRefreshToken (state, action: PayloadAction<string>) {
      state.refreshToken = action.payload
      window.localStorage.setItem('refresh-token', action.payload)
    },

    logout (state) {
      state.accessToken = null
      state.refreshToken = null
      state.role = null
      window.localStorage.setItem('refresh-token', '')
    }
  }
})

export const { setToken, logout, setRefreshToken, setRole } = authSlice.actions
export default authSlice.reducer
