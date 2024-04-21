"use client";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

import userReducer from "./user.slice";

const rootReducer = combineReducers({
  user: userReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});
