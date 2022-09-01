import { createSlice } from "@reduxjs/toolkit";

const initialState = { accessToken: null };

const authSlice = createSlice({ name: 'auth', initialState, reducers: {
    setToken(state, action) {
        state.accessToken = action.payload.jwt;
    }
}});

export const  { setToken } = authSlice.actions;
export default authSlice.reducer;
