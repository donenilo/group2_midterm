import React from 'react';
import { useSearch } from '../hooks/useSearch';

const TAGS = ['', 'pop', 'hip-hop', 'rock', 'r&b', 'indie'];
const SORTS = [
  { value: '',             label: 'Relevance' },
  { value: 'popularity',  label: 'Popularity' },
  { value: 'release_date',label: 'Release date' },
];

function SearchBar() {
  const { query, tag, sort, setQuery, setTag, setSort, resetFilters } = useSearch();

  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search songs or artists..."
      />

      {/* Genre filter */}
      <select value={tag} onChange={(e) => setTag(e.target.value)}>
        <option value="">All genres</option>
        {TAGS.filter(t => t).map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      {/* Sort filter */}
      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        {SORTS.map(s => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>

      <button onClick={resetFilters}>Clear</button>
    </div>
  );
}

export default SearchBar;