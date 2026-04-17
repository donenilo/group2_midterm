import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from 'use-debounce';
import { useEffect, useMemo } from 'react';
import { setQuery, setDebouncedQuery, setTag, setSort, resetFilters } from '../store/filtersSlice';
import { useSearchSongsQuery } from '../services/geniusApi';

function getReleaseTime(song) {
  const value = song?.release_date || song?.release_date_for_display;
  if (!value) {
    return 0;
  }

  const time = Date.parse(value);
  return Number.isNaN(time) ? 0 : time;
}

function sortSongs(songs, sort) {
  const items = [...songs];

  if (sort === 'popularity') {
    return items.sort((left, right) => (right?.stats?.pageviews ?? 0) - (left?.stats?.pageviews ?? 0));
  }

  if (sort === 'release_date') {
    return items.sort((left, right) => getReleaseTime(right) - getReleaseTime(left));
  }

  return items;
}

export function useSearch() {
  const dispatch = useDispatch();
  const { query, debouncedQuery, tag, sort } = useSelector((s) => s.filters);

  const [debounced] = useDebounce(query, 500); // 500ms after user stops typing

  useEffect(() => {
    dispatch(setDebouncedQuery(debounced));
  }, [debounced, dispatch]);

  const { data: songs, isLoading, isError, isFetching, error } = useSearchSongsQuery(
    { q: debouncedQuery, tag, sort },
    { skip: !debouncedQuery.trim() }
  );

  const sortedSongs = useMemo(() => sortSongs(songs ?? [], sort), [songs, sort]);

  return {
    query,
    tag,
    sort,
    songs: sortedSongs,
    isLoading: isLoading || isFetching,
    isError,
    error,
    isEmpty: !isLoading && debouncedQuery.trim() && sortedSongs.length === 0,

    setQuery:     (val) => dispatch(setQuery(val)),
    setTag:       (val) => dispatch(setTag(val)),
    setSort:      (val) => dispatch(setSort(val)),
    resetFilters: ()    => dispatch(resetFilters()),
  };
}