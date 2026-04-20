import React from 'react';
import { useSearch } from '../hooks/useSearch';

function SearchBar({ isLarge }) {
  const { query, setQuery, submitSearch, clearSearch } = useSearch();

  return (
    <div className={`search-bar-wrapper ${isLarge ? 'large-view' : ''}`}>
      <div className="search-pill">
        <span className="search-icon">
          <img 
            src="https://img.freepik.com/premium-vector/search-icon-logo-vector-design-template_827767-481.jpg" 
            alt="Logo" 
          />
      </span>
        <input
          type="text"
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              submitSearch();
            }
          }}
          placeholder="Search for lyrics..."
        />
        
        {/* X onli appears pag may tinype */}
        {query && (
          <button 
            className="icon-btn clear-x" 
            onClick={clearSearch}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;