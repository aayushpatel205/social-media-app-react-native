import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userNumber: "",
  userBio: "",
  userAddress: "",
  userDisplayName: "",
  profileImg: "",
  sessionData: null,
  posts: "",
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      state.userNumber = action.payload.userNumber;
      state.userAddress = action.payload.userAddress;
      state.userBio = action.payload.userBio;
      state.userDisplayName = action.payload.userDisplayName;
    },

    setSessionData: (state, action) => {
      state.sessionData = action.payload;
    },

    setProfileImgLink: (state, action) => {
      state.profileImg = action.payload;
    },
  },
});

export const { setUserDetails , setSessionData , setProfileImgLink } = profileSlice.actions;
export default profileSlice.reducer;
