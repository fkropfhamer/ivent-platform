import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/auth-slice'
import { apiSlice, authApiSlice } from '../services/api'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([authApiSlice.middleware, apiSlice.middleware])
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
