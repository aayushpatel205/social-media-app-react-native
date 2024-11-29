import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: "Home"
};

export const navigationSlice = createSlice({
    name: "navigation",
    initialState,
    reducers: {
        changeNavigation: (state, action) => {
            state.value = action.payload;
        }
    }
});

export const { changeNavigation } = navigationSlice.actions;
export default navigationSlice.reducer;