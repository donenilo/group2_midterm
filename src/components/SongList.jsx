import React from 'react';
import { Link } from 'react-router-dom';
import { useSearch } from '../hooks/useSearch';
import Pagination from './Pagination';

function SongList() {
  const {
    songs, isLoading, isLoadingMoreResults, isError, error, isEmpty, query,
    currentPage, totalPages, showPagination, totalResults,
    setCurrentPage
  } = useSearch();

  const status = error?.status;
  const skeletonItems = Array.from({ length: 8 }, (_, index) => index);

  if (isLoading) {
    return (
      <div className="songs-loading" role="status" aria-live="polite">
        <div className="songs-loading__header">
          <span className="songs-loading__pulse" aria-hidden="true" />
          <p className="songs-loading__title">Loading songs...</p>
        </div>

        <ul className="song-list song-list-skeleton">
          {skeletonItems.map((item) => (
            <li key={item} className="song-item song-item-skeleton" aria-hidden="true">
              <div className="song-item-skeleton__media skeleton-shimmer" />
              <div className="song-item-skeleton__line skeleton-shimmer" />
              <div className="song-item-skeleton__line song-item-skeleton__line--short skeleton-shimmer" />
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (isError) {
    if (status === 401) {
      return <p className="results-status-message">Genius API unauthorized. Set GENIUS_ACCESS_TOKEN and restart deploy/dev server.</p>;
    }
    if (status === 403) {
      return <p className="results-status-message">Genius API forbidden. Verify GENIUS_ACCESS_TOKEN is a valid Genius access token and not a client ID.</p>;
    }
    if (status === 404) {
      return <p className="results-status-message">API route not found. Ensure Vercel deployed the latest commit with API proxy routing.</p>;
    }
    return <p className="results-status-message">Something went wrong. Please try again.</p>;
  }
  if (isEmpty) return <p className="results-status-message">No results for "{query}".</p>;

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

      {isLoadingMoreResults && (
        <p className="loading-more-results" role="status" aria-live="polite">
          Loading more results...
        </p>
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