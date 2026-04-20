import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  query: "",
  debouncedQuery: "",
  tag: "",
  sort: "",
  currentPage: 1, // ✅ added
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
      state.currentPage = 1; 
    },
    setDebouncedQuery: (state, action) => {
      state.debouncedQuery = action.payload;
      state.currentPage = 1; 
    },
    setTag:   (state, action) => { state.tag  = action.payload; },
    setSort:  (state, action) => { state.sort = action.payload; },
    setCurrentPage: (state, action) => { state.currentPage = action.payload; }, // ✅ added
    resetFilters: () => initialState,
  },
});

export const { setQuery, setDebouncedQuery, setTag, setSort, setCurrentPage, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;