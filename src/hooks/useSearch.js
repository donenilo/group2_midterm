import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from 'use-debounce';
import { useEffect, useMemo } from 'react';
import { setQuery, setDebouncedQuery, setTag, setSort, setCurrentPage, resetFilters } from '../store/filtersSlice';
import { useSearchSongsQuery } from '../services/geniusApi';

const RESULTS_PER_PAGE = 20; //20 results per page

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
  const { query, debouncedQuery, tag, sort, currentPage } = useSelector((s) => s.filters);

  const [debounced] = useDebounce(query, 500);

  useEffect(() => {
    dispatch(setDebouncedQuery(debounced));
  }, [debounced, dispatch]);

  const { data: songs, isLoading, isError, isFetching, error } = useSearchSongsQuery(
    { q: debouncedQuery, tag, sort },
    { skip: !debouncedQuery.trim() }
  );

  const sortedSongs = useMemo(() => sortSongs(songs ?? [], sort), [songs, sort]);

  //Pagination logic
  const totalResults = sortedSongs.length;
  const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);
  const showPagination = totalResults > RESULTS_PER_PAGE; // only show if exceeds 20
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
    isError,
    error,
    isEmpty: !isLoading && debouncedQuery.trim() && sortedSongs.length === 0,

    //Pagination
    currentPage,
    totalPages,
    showPagination,
    totalResults,

    setQuery:       (val) => dispatch(setQuery(val)),
    setTag:         (val) => dispatch(setTag(val)),
    setSort:        (val) => dispatch(setSort(val)),
    setCurrentPage: (val) => dispatch(setCurrentPage(val)),
    resetFilters:   ()    => dispatch(resetFilters()),
  };
}