import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: false,
};

export const isChangedSlice = createSlice({
  name: "isChanged",
  initialState,
  reducers: {
    setIsChangedToTrue: (state, action) => {
      state.value = true;
    },
    setIsChangedToFalse: (state, action) => {
      state.value = false;
    },
  },
});

export const { setIsChangedToTrue, setIsChangedToFalse } =
  isChangedSlice.actions;
export default isChangedSlice.reducer;
