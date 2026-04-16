import React from 'react';
import { useSearch } from '../hooks/useSearch';

function SongList() {
  const { songs, isLoading, isError, isEmpty, query } = useSearch();

  if (!query.trim())  return <p>Search for a song or artist to get started.</p>;
  if (isLoading)      return <p>Loading...</p>;
  if (isError)        return <p>Something went wrong. Please try again.</p>;
  if (isEmpty)        return <p>No results for "{query}".</p>;

  return (
    <ul className="song-list">
      {songs.map((song) => (
        <li key={song.id} className="song-item">
          <img src={song.song_art_image_thumbnail_url} alt={song.title} />
          <div>
            <p className="song-title">{song.full_title}</p>
            <p className="song-artist">{song.primary_artist.name}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default SongList;