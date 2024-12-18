import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    savedPosts: [],
};

export const savedPostSlice = createSlice({
    name: "savedPosts",
    initialState,
    reducers: {
        setSavedPosts: (state, action) => {
            state.savedPosts.push(action.payload);
        },
    },
});