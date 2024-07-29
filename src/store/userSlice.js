import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.user = action.payload;
    },

    logoutUser: (state, action) => {
      state.user = null;
    },
  },
});

export const { loginUser, logoutUser } = userSlice.actions;
