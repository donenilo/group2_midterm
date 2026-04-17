import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  query: "",
  debouncedQuery: "",
  tag: "",
  sort: "",
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setQuery:         (state, action) => { state.query          = action.payload; },
    setDebouncedQuery:(state, action) => { state.debouncedQuery = action.payload; },
    setTag:           (state, action) => { state.tag            = action.payload; },
    setSort:          (state, action) => { state.sort           = action.payload; },
    resetFilters:     () => initialState,
  },
});

export const { setQuery, setDebouncedQuery, setTag, setSort, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;