import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "../features/profileSlice";
import isChangedReducer from "../features/isProfileChangedSlice";
import navigationReducer from "../features/navigationSlice";

export const store = configureStore({
    reducer: {
        profileReducer,
        isChangedReducer,
        navigationReducer
    },
})