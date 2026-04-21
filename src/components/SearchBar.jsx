import { useSearch } from '../hooks/useSearch';

function SearchBar({ isLarge }) {
  const { query, setQuery, submitSearch, clearSearch } = useSearch();

  return (
    <div className={`search-bar-wrapper ${isLarge ? 'large-view' : ''}`}>
      <form
        className="search-pill"
        onSubmit={(e) => {
          e.preventDefault();
          submitSearch();
        }}
      >
        <button type="submit" className="search-icon" aria-label="Search">
          <img src="/search-icon.png" alt="" aria-hidden="true" />
        </button>
        {/* Allow users to submit by clicking the icon or pressing Enter. */}
        <input
          type="text"
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for lyrics..."
        />
        
        {/* X onli appears pag may tinype */}
        {query && (
          <button
            type="button"
            className="icon-btn clear-x" 
            onClick={clearSearch}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </form>
    </div>
  );
}

export default SearchBar;