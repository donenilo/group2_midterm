import React from 'react';

function GeniusConnect() {
  const hasAccessToken = Boolean((import.meta.env.VITE_GENIUS_ACCESS_TOKEN || '').trim());

  if (hasAccessToken) {
    return null;
  }

  return (
    <section className="auth-panel">
      <div className="auth-panel__copy">
        <p className="auth-panel__eyebrow">Genius Connection</p>
        <h2>Authorization Required</h2>
        <p>
          This app uses the Genius API. Configure VITE_GENIUS_ACCESS_TOKEN in your environment to enable search functionality.
        </p>
      </div>
    </section>
  );
}

export default GeniusConnect;