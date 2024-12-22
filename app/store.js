import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "../features/profileSlice";
import navigationReducer from "../features/navigationSlice";

export const store = configureStore({
    reducer: {
        profileReducer,
        navigationReducer,
    },
})