import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    passenger_id: null,
    passenger_name: null,
    passenger_email: null,
    passenger_dob: null,
  },
  reducers: {
    setUser: (state, action) => {
      console.log({ action });
      state.passenger_id = action.payload.passenger_id;
      state.passenger_name = action.payload.passenger_name;
      state.passenger_email = action.payload.passenger_email;
      state.passenger_dob = action.payload.passenger_dob;
    },
    clearUser: (state) => {
      state = initialState;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
