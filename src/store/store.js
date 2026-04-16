import { configureStore } from "@reduxjs/toolkit";
import { geniusApi } from "../services/geniusApi";
import filtersReducer from "./filtersSlice";

export const store = configureStore({
  reducer: {
    [geniusApi.reducerPath]: geniusApi.reducer,
    filters: filtersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(geniusApi.middleware),
});