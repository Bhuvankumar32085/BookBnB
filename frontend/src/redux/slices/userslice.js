import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    loggedUser: null,
    isLogging: false,
  },
  reducers: {
    setLoggedUser: (state, action) => {
      state.loggedUser = action.payload;
    },
    setIsLogging: (state, action) => {
      state.isLogging = action.payload;
    },
  },
});

export const { setLoggedUser, setIsLogging } = userSlice.actions;
export default userSlice.reducer;
