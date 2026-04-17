import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetSongByIdQuery, useGetSongReferentsQuery, useGetLyricsQuery } from '../services/geniusApi';

function SongDetailsPage() {
  const { songId } = useParams();
  const { data: song, isLoading, isError } = useGetSongByIdQuery(songId, {
    skip: !songId,
  });
  const {
    data: referents,
    isLoading: isReferentsLoading,
    isError: isReferentsError,
  } = useGetSongReferentsQuery(songId, {
    skip: !songId,
  });

  const artistName = song?.primary_artist?.name || '';
  const songTitle = song?.title || '';
  const { data: lyrics, isLoading: isLyricsLoading, isError: isLyricsError } = useGetLyricsQuery(
    { artist: artistName, title: songTitle },
    { skip: !artistName || !songTitle }
  );

  if (!songId) {
    return <p>Missing song id.</p>;
  }

  if (isLoading) {
    return <p>Loading song details...</p>;
  }

  if (isError || !song) {
    return (
      <div className="song-details-page">
        <p>Something went wrong while loading the song details.</p>
        <Link to="/songs" className="song-details-page__back">
          Back to results
        </Link>
      </div>
    );
  }

  return (
    <div className="song-details-page">
      <Link to="/songs" className="song-details-page__back">
        Back to results
      </Link>

      <article className="song-details-card">
        <img
          src={song.song_art_image_url || song.song_art_image_thumbnail_url}
          alt={song.title}
          className="song-details-card__image"
        />

        <div className="song-details-card__content">
          <p className="auth-panel__eyebrow">Song details</p>
          <h2>{song.full_title || song.title}</h2>
          <p>{song.primary_artist?.name}</p>

          <dl className="song-details-card__meta">
            <div>
              <dt>Release date</dt>
              <dd>{song.release_date_for_display || song.release_date || 'Unavailable'}</dd>
            </div>
            <div>
              <dt>Page views</dt>
              <dd>{song.stats?.pageviews ?? 'Unavailable'}</dd>
            </div>
          </dl>
        </div>
      </article>

      <section className="song-lyrics-panel" aria-label="Song lyrics">
        <p className="auth-panel__eyebrow">Lyrics</p>
        <h2>Full Lyrics</h2>
        {isLyricsLoading ? (
          <p>Loading lyrics...</p>
        ) : isLyricsError ? (
          <p>Lyrics could not be loaded.</p>
        ) : lyrics ? (
          <div className="song-lyrics-panel__lyrics">
            <pre className="song-lyrics-panel__text">{lyrics}</pre>
          </div>
        ) : (
          <p>No lyrics available for this song.</p>
        )}
      </section>
    </div>
  );
}

export default SongDetailsPage;