import { useDispatch, useSelector } from 'react-redux';
import { useMemo } from 'react';
import { setQuery, setDebouncedQuery, setTag, setSort, setCurrentPage, resetFilters } from '../store/filtersSlice';
import { useSearchSongsQuery } from '../services/geniusApi';

const RESULTS_PER_PAGE = 20; //displays 20 results per page in the UI, pagination is client-side based on the full result set returned from the API

function getReleaseTime(song) {
  const value = song?.release_date || song?.release_date_for_display;
  if (!value) return 0;
  const time = Date.parse(value);
  return Number.isNaN(time) ? 0 : time;
}

function sortSongs(songs, sort) {
  const items = [...songs];
  if (sort === 'popularity') {
    return items.sort((l, r) => (r?.stats?.pageviews ?? 0) - (l?.stats?.pageviews ?? 0));
  }
  if (sort === 'release_date') {
    return items.sort((l, r) => getReleaseTime(r) - getReleaseTime(l));
  }
  return items;
}

export function useSearch() {
  const dispatch = useDispatch();
  const { query, debouncedQuery, tag, sort, currentPage, isLoadingMoreResults } = useSelector((s) => s.filters);

  // Skip API calls until the user submits a non-empty query i.e. presses Enter or clicks the search button.
  const { data: songs, isLoading, isError, isFetching, error } = useSearchSongsQuery(
    { q: debouncedQuery, tag },
    { skip: !debouncedQuery.trim() }
  );

  // Sorting happens client-side so users can switch sort instantly.
  const sortedSongs = useMemo(() => sortSongs(songs ?? [], sort), [songs, sort]);

  // Derive paginated view from the full result set.
  const totalResults = sortedSongs.length;
  const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);
  const showPagination = totalResults > RESULTS_PER_PAGE;
  const paginatedSongs = sortedSongs.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  );

  return {
    query,
    tag,
    sort,
    songs: paginatedSongs,
    allSongs: sortedSongs,
    isLoading: isLoading || isFetching,
    isLoadingMoreResults,
    isError,
    error,
    isEmpty: !isLoading && debouncedQuery.trim() && sortedSongs.length === 0,

    // Pagination state exposed to page/list components.
    currentPage,
    totalPages,
    showPagination,
    totalResults,

    setQuery:       (val) => dispatch(setQuery(val)),
    submitSearch:   (val) => dispatch(setDebouncedQuery(val ?? query)),
    clearSearch:    ()    => {
      dispatch(setQuery(''));
      dispatch(setDebouncedQuery(''));
    },
    setTag:         (val) => dispatch(setTag(val)),
    setSort:        (val) => dispatch(setSort(val)),
    setCurrentPage: (val) => dispatch(setCurrentPage(val)),
    resetFilters:   ()    => dispatch(resetFilters()),
  };
}