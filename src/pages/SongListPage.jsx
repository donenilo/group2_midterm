import React from 'react';
import GeniusConnect from '../components/GeniusConnect';
import SearchBar from '../components/SearchBar';
import SongList from '../components/SongList';

function SongListPage() {
  return (
    <section className="page page--results" aria-label="Song search results">
      <GeniusConnect />
      <SearchBar />
      <SongList />
    </section>
  );
}

export default SongListPage;