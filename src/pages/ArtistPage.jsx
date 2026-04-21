import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetArtistByIdQuery, useGetArtistSongsQuery } from '../services/geniusApi';
import './ArtistPage.css';

function ArtistPage() {
  const { artistId } = useParams();
  const { data: artist, isLoading: isArtistLoading } = useGetArtistByIdQuery(artistId);
  const { data: songs = [], isLoading: isSongsLoading } = useGetArtistSongsQuery(artistId);
  const songSkeletonRows = Array.from({ length: 6 }, (_, index) => index);

  if (isArtistLoading) {
    return (
      <div className="loading-container" role="status" aria-live="polite">
        <div className="loading-spinner" aria-hidden="true" />
        <p className="loading-spinner-text">Loading artist profile...</p>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="error-container">
        <p>Artist not found</p>
        <Link to="/songs" className="back-link">← Back to Search</Link>
      </div>
    );
  }

  // Improved album grouping: deduplicate and sort by release date
  const albumMap = new Map();

  songs.forEach((song) => {
    if (song.album) {
      const albumId = song.album.id;
      // Only keep first occurrence of each album (newer albums first in API response)
      if (!albumMap.has(albumId)) {
        albumMap.set(albumId, {
          id: albumId,
          name: song.album.name,
          cover_art_url: song.album.cover_art_url,
          release_date: song.album.release_date,
          artist: song.album.artist || song.primary_artist.name,
          track_count: song.album.track_count || 1
        });
      }
    }
  });

  // Sort albums by release date (newest first)
  const albums = Array.from(albumMap.values()).sort((a, b) => {
    const dateA = new Date(a.release_date || 0).getTime();
    const dateB = new Date(b.release_date || 0).getTime();
    return dateB - dateA;
  });

  const popularSongs = songs.slice(0, 50); // Top 50 songs

  return (
    <div className="artist-page">
      <nav className="artist-nav">
        <Link to="/songs" className="back-button">← Back to Search</Link>
      </nav>

      {/* Artist Header */}
      <header className="artist-hero">
        <div className="artist-header-content">
          {artist.image_url && (
            <img
              src={artist.image_url}
              alt={artist.name}
              className="artist-image"
            />
          )}
          <div className="artist-info">
            <h1 className="artist-name">{artist.name}</h1>
            {artist.description?.plain && (
              <p className="artist-description">{artist.description.plain.substring(0, 300)}...</p>
            )}
            <div className="artist-stats">
              
              <span className="stat-item">
                🎵 {songs.length} Songs
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="artist-main">
        <div className="content-container">
          {/* Albums Section */}
          {albums.length > 0 && (
            <section className="albums-section">
              <h2 className="section-title">Albums</h2>
              <div className="albums-grid">
                {albums.map((album) => (
                  <Link
                    key={album.id}
                    to={`/albums/${album.id}`}
                    className="album-card"
                  >
                    {album.cover_art_url && (
                      <img
                        src={album.cover_art_url}
                        alt={album.name}
                        className="album-cover"
                      />
                    )}
                    <div className="album-info">
                      <h3 className="album-name">{album.name}</h3>
                      {album.release_date && (
                        <p className="album-year">
                          {new Date(album.release_date).getFullYear()}
                        </p>
                      )}
                      <p className="album-track-count">
                        {album.track_count} tracks
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Popular Songs Section */}
          {popularSongs.length > 0 && (
            <section className="popular-section">
              <h2 className="section-title">Popular Songs</h2>
              {isSongsLoading ? (
                <div className="loading-text" role="status" aria-live="polite">
                  <p className="loading-text__label">Loading songs...</p>
                  <div className="artist-song-skeleton-list" aria-hidden="true">
                    {songSkeletonRows.map((row) => (
                      <div key={row} className="artist-song-skeleton-item">
                        <div className="artist-song-skeleton-rank artist-skeleton-shimmer" />
                        <div className="artist-song-skeleton-media artist-skeleton-shimmer" />
                        <div className="artist-song-skeleton-content">
                          <div className="artist-song-skeleton-line artist-skeleton-shimmer" />
                          <div className="artist-song-skeleton-line artist-song-skeleton-line--short artist-skeleton-shimmer" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="songs-list">
                  {popularSongs.map((song, index) => (
                    <Link
                      key={song.id}
                      to={`/songs/${song.id}`}
                      className="song-list-item"
                    >
                      <div className="song-rank">{index + 1}</div>
                      <div className="song-card-small">
                        {song.song_art_image_thumbnail_url && (
                          <img
                            src={song.song_art_image_thumbnail_url}
                            alt={song.title}
                            className="song-thumbnail"
                          />
                        )}
                        <div className="song-details">
                          <h4 className="song-title">{song.title}</h4>
                          {song.album && (
                            <p className="song-album">{song.album.name}</p>
                          )}
                        </div>
                      </div>
                      <div className="song-play">
                        <span>▶</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default ArtistPage;
