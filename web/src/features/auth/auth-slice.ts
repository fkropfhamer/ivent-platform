import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    accessToken: string | null
    refreshToken: string | null
}

const refreshToken = window.localStorage.getItem("refresh-token") ? window.localStorage.getItem("refresh-token") : null

const initialState: AuthState = { accessToken: null, refreshToken };

const authSlice = createSlice({ name: 'auth', initialState, reducers: {
    setToken(state, action: PayloadAction<string>) {
        state.accessToken = action.payload;
    },

    setRefreshToken(state, action: PayloadAction<string>) {
        state.refreshToken = action.payload
        window.localStorage.setItem("refresh-token", action.payload)
    },

    logout(state) {
        state.accessToken = null
        state.refreshToken = null
        window.localStorage.setItem("refresh-token", "")
    }
}});

export const  { setToken, logout, setRefreshToken } = authSlice.actions;
export default authSlice.reducer;
