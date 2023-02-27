import { configureStore } from "@reduxjs/toolkit";
import counterReducer from '../features/counter/counter-slice';
import authReducer from '../features/auth/auth-slice';
import { apiSlice } from "../services/api";

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        auth: authReducer,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
