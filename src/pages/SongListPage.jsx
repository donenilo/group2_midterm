import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useSearch } from '../hooks/useSearch'; 
import SearchBar from '../components/SearchBar';
import SongList from '../components/SongList';
import './SongPages.css';

function SongListPage() {
  const searchQuery = useSelector((state) => state.filters?.query || "");
  const hasSearched = searchQuery.trim().length > 0;
  
  // Para sa trends
  const { setQuery } = useSearch();

  const handleTrendingClick = (artist) => {
    setQuery(artist);
  };

  return (
    <main className={`home-wrapper ${hasSearched ? 'mode-results' : 'mode-landing'}`}>
      

      <div className="main-content">
        <div className="landing-hero text-center">
          <h1 className="hero-brand">Lyricist</h1>
          <p className="hero-subtitle">Find your favorite song lyrics in seconds.</p>
        </div>

        <section className="search-section mx-auto">
          <SearchBar hideFilters={!hasSearched} isLarge={!hasSearched} />
          
          {!hasSearched && (
            <div className="featured-trending mt-4 text-center">
              <span className="text-muted me-2">Trending Artists:</span>
              {['Taylor Swift', 'Olivia Rodrigo', 'Zara Larsson', 'PinkPantheress'].map((artist) => (
                <button 
                  key={artist}
                  className="btn btn-link trending-tag text-decoration-none p-1 mx-1"
                  onClick={() => handleTrendingClick(artist)}
                >
                  {artist}
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="results-section mt-5">
          <SongList />
        </section>
      </div>
    </main>
  );
}

export default SongListPage;