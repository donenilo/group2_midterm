import React from 'react';
import { Link } from 'react-router-dom';
import { useSearch } from '../hooks/useSearch';
import Pagination from './Pagination';

function SongList() {
  const {
    songs, isLoading, isError, error, isEmpty, query,
    currentPage, totalPages, showPagination, totalResults,
    setCurrentPage
  } = useSearch();

  const status = error?.status;

  if (isLoading) return <p>Loading...</p>;
  if (isError) {
    if (status === 401) return <p>Genius API unauthorized. Set GENIUS_ACCESS_TOKEN or VITE_GENIUS_ACCESS_TOKEN and restart dev server.</p>;
    return <p>Something went wrong. Please try again.</p>;
  }
  if (isEmpty) return <p>No results for "{query}".</p>;

  return (
    <div>
      {/* Pagination TOP — only shows if results exceed 20 */}
      {showPagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <ul className="song-list">
        {songs.map((song) => (
          <li key={song.id} className="song-item">
            <Link to={`/songs/${song.id}`} className="song-item__link">
              <img src={song.song_art_image_thumbnail_url} alt={song.title} />
              <div>
                <p className="song-title">{song.full_title}</p>
                <Link
                  to={`/artists/${song.primary_artist.id}`}
                  className="song-artist-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  {song.primary_artist.name}
                </Link>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* Pagination BOTTOM — only shows if results exceed 20 */}
      {showPagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

export default SongList;