import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
    accessToken: string | null
}

const initialState: AuthState = { accessToken: null };

const authSlice = createSlice({ name: 'auth', initialState, reducers: {
    setToken(state, action) {
        state.accessToken = action.payload.jwt;
    },

    logout(state) {
        state.accessToken = null
    }
}});

export const  { setToken } = authSlice.actions;
export default authSlice.reducer;
