import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetSongByIdQuery, useGetLyricsQuery } from '../services/geniusApi';
import './SongPages.css';

function SongDetailsPage() {
  const { songId } = useParams();
  const { data: song, isLoading: isSongLoading } = useGetSongByIdQuery(songId);

  const artistName = song?.primary_artist?.name || '';
  const songTitle = song?.title || '';

  const { data: lyrics, isLoading: isLyricsLoading } = useGetLyricsQuery(
    { artist: artistName, title: songTitle },
    { skip: !artistName || !songTitle }
  );

  if (isSongLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="details-page">
      {/* HEADER FOR LYRICS PAGE */}
      <header className="song-hero">
        <div className="hero-container">
          <div className="hero-artwork">
            <img src={song.song_art_image_url} alt={song.title} />
          </div>
          <div className="hero-info">
            <h1 className="hero-title">{song.title}</h1>
            <h2 className="hero-artist">{song.primary_artist.name}</h2>
            <div className="hero-meta">
              <p>Produced by: {song.producer_artists?.map(p => p.name).join(', ') || 'N/A'}</p>
              <p>Released: {song.release_date_for_display}</p>
            </div>
          </div>
        </div>
      </header>

      {/* BG OF LYRICS */}
      <main className="lyrics-container">
        <nav className="lyrics-nav">
          <Link to="/songs" className="back-link">← Back to Search</Link>
        </nav>
        
        <div className="lyrics-content">
          <h3 className="section-label">Lyrics</h3>
          {isLyricsLoading ? (
            <p>Fetching lyrics...</p>
          ) : (
            <pre className="lyrics-text">{lyrics || "Lyrics not found for this track."}</pre>
          )}
        </div>
      </main>
    </div>
  );
}

export default SongDetailsPage;