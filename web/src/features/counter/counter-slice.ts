import { createSlice } from "@reduxjs/toolkit";

const initialState = { value: 0 };

const counterSlice = createSlice({ name: "counter", initialState, reducers: {
    incremented(state) {
        state.value++;
    },
    amountAdded(state, action) {
        state.value += action.payload;
    },
}});

export const { incremented, amountAdded } = counterSlice.actions;

export default counterSlice.reducer;

