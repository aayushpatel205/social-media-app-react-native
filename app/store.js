import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "../features/profileSlice";
import navigationReducer from "../features/navigationSlice";
import savedPostsReducer from "../features/savedPostSlice";

export const store = configureStore({
    reducer: {
        profileReducer,
        navigationReducer,
        savedPostsReducer
    },
})