import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetSongByIdQuery, useGetLyricsQuery } from '../services/geniusApi';
import './SongPages.css';

function SongDetailsPage() {
  const { songId } = useParams();
  const {
    data: song,
    isLoading: isSongLoading,
    isError: isSongError,
    error: songError,
  } = useGetSongByIdQuery(songId, { skip: !songId });

  const artistName = song?.primary_artist?.name || '';
  const songTitle = song?.title || '';

  const { data: lyrics, isLoading: isLyricsLoading } = useGetLyricsQuery(
    { artist: artistName, title: songTitle },
    { skip: !artistName || !songTitle }
  );

  if (isSongLoading) {
    return (
      <div className="page-loader" role="status" aria-live="polite">
        <span className="page-loader__ring" aria-hidden="true" />
        <p className="page-loader__text">Preparing song details...</p>
      </div>
    );
  }

  if (isSongError || !song) {
    const status = songError?.status;
    const errorText =
      status === 404
        ? 'Song details were not found. Please go back and try a different result.'
        : 'Unable to load song details right now. Please try again.';

    return (
      <main className="details-page">
        <section className="lyrics-container" aria-live="polite">
          <nav className="lyrics-nav">
            <Link to="/songs" className="back-link">← Back to Search</Link>
          </nav>
          <p className="results-status-message">{errorText}</p>
        </section>
      </main>
    );
  }

  return (
    <div className="details-page">
      <div className="song-layout">
        {/* HERO SECTION */}
        <header className="song-hero">
          <div className="hero-container">
            <h1 className="hero-title">{song.title}</h1>
            
            <div className="hero-media">
              {song.videoEmbed?.url ? (
                <div className="hero-video-embed">
                  <iframe
                    src={song.videoEmbed.url}
                    title={song.title}
                    allowFullScreen
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              ) : (
                <div className="hero-artwork">
                  <img src={song.song_art_image_url} alt={song.title} />
                </div>
              )}
            </div>

            <div className="hero-info">
              <Link 
                to={`/artists/${song.primary_artist.id}`}
                className="hero-artist-link"
              >
                🎤 {song.primary_artist.name}
              </Link>
              {song.album && (
                <p className="hero-album-info">
                  📀 {song.album.name}
                </p>
              )}
              <div className="hero-meta">
                <p>Produced by: {song.producer_artists?.map(p => p.name).join(', ') || 'N/A'}</p>
                <p>Released: {song.release_date_for_display}</p>
              </div>
            </div>
          </div>
        </header>

        {/* LYRICS SECTION */}
        <main className="lyrics-container">
          <nav className="lyrics-nav">
            <Link to="/songs" className="back-link">← Back to Search</Link>
          </nav>
          
          <div className="lyrics-content">
            <h3 className="section-label">Lyrics</h3>
            {isLyricsLoading ? (
              <div className="lyrics-loading" role="status" aria-live="polite">
                <p className="lyrics-loading__label">Fetching lyrics...</p>
                <div className="lyrics-loading__line skeleton-shimmer" />
                <div className="lyrics-loading__line skeleton-shimmer" />
                <div className="lyrics-loading__line lyrics-loading__line--short skeleton-shimmer" />
              </div>
            ) : (
              <pre className="lyrics-text">{lyrics || "Lyrics not found for this track."}</pre>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default SongDetailsPage;