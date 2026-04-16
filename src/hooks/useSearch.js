import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from 'use-debounce';
import { useEffect } from 'react';
import { setQuery, setDebouncedQuery, setTag, setSort, resetFilters } from '../store/filtersSlice';
import { useSearchSongsQuery } from '../services/geniusApi';

export function useSearch() {
  const dispatch = useDispatch();
  const { query, debouncedQuery, tag, sort } = useSelector((s) => s.filters);

  const [debounced] = useDebounce(query, 500); // 500ms after user stops typing

  useEffect(() => {
    dispatch(setDebouncedQuery(debounced));
  }, [debounced, dispatch]);

  const { data: songs, isLoading, isError, isFetching } = useSearchSongsQuery(
    { q: debouncedQuery, tag, sort },
    { skip: !debouncedQuery.trim() }
  );

  return {
    query,
    tag,
    sort,
    songs: songs ?? [],
    isLoading: isLoading || isFetching,
    isError,
    isEmpty: !isLoading && debouncedQuery.trim() && songs?.length === 0,

    setQuery:     (val) => dispatch(setQuery(val)),
    setTag:       (val) => dispatch(setTag(val)),
    setSort:      (val) => dispatch(setSort(val)),
    resetFilters: ()    => dispatch(resetFilters()),
  };
}