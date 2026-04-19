import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetAlbumByIdQuery, useGetAlbumSongsQuery } from '../services/geniusApi';
import './AlbumPage.css';

function AlbumPage() {
  const { albumId } = useParams();
  const { data: album, isLoading: isAlbumLoading } = useGetAlbumByIdQuery(albumId);
  const { data: songs = [], isLoading: isSongsLoading } = useGetAlbumSongsQuery(albumId);

  if (isAlbumLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading album...</div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="error-container">
        <p>Album not found</p>
        <Link to="/songs" className="back-link">← Back to Search</Link>
      </div>
    );
  }

  const releaseYear = album.release_date
    ? new Date(album.release_date).getFullYear()
    : 'Unknown';

  const mainArtist = album.artists?.[0];

  return (
    <div className="album-page">
      <nav className="album-nav">
        <Link to="/songs" className="back-button">← Back to Search</Link>
      </nav>

      {/* Album Header */}
      <header className="album-hero">
        <div className="album-header-content">
          {album.cover_art_url && (
            <img
              src={album.cover_art_url}
              alt={album.name}
              className="album-cover-large"
            />
          )}
          <div className="album-header-info">
            <p className="album-label">Album</p>
            <h1 className="album-title">{album.name}</h1>
            {mainArtist && (
              <Link
                to={`/artists/${mainArtist.id}`}
                className="album-artist-link"
              >
                <span className="artist-avatar">🎤</span>
                {mainArtist.name}
              </Link>
            )}
            <div className="album-metadata">
              <span className="meta-item">{releaseYear}</span>
              <span className="meta-item">•</span>
              <span className="meta-item">{songs.length} Songs</span>
            </div>
            {album.description?.plain && (
              <p className="album-description">
                {album.description.plain}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Play Button Bar */}
      <div className="album-actions">
        <button className="btn-play">
          ▶ Play Album
        </button>
        <button className="btn-favorite">
          ❤️ Add to Library
        </button>
      </div>

      {/* Tracklist */}
      <main className="album-main">
        <div className="content-container">
          <section className="tracklist-section">
            <h2 className="section-title">Tracklist</h2>

            {isSongsLoading ? (
              <p className="loading-text">Loading tracks...</p>
            ) : songs.length === 0 ? (
              <p className="no-songs">No tracks available</p>
            ) : (
              <div className="tracklist">
                {songs.map((song, index) => (
                  <Link
                    key={song.id}
                    to={`/songs/${song.id}`}
                    className="track-item"
                  >
                    <div className="track-number">{index + 1}</div>
                    <div className="track-info">
                      <h4 className="track-title">{song.title}</h4>
                      {song.featured_artists?.length > 0 && (
                        <p className="track-featuring">
                          feat. {song.featured_artists.map(a => a.name).join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="track-stats">
                      {song.stats?.pageviews && (
                        <span className="track-views">
                          {(song.stats.pageviews / 1000000).toFixed(1)}M
                        </span>
                      )}
                    </div>
                    <div className="track-play">
                      <span>▶</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default AlbumPage;
