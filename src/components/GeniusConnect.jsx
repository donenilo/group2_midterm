import React, { useEffect, useMemo, useState } from 'react';
import {
  buildGeniusAuthorizeUrl,
  createGeniusOAuthState,
  getGeniusOAuthConfig,
} from '../services/geniusOAuth';

function GeniusConnect() {
  const config = useMemo(() => getGeniusOAuthConfig(), []);
  const [callback, setCallback] = useState(null);
  const hasAccessToken = Boolean((import.meta.env.VITE_GENIUS_ACCESS_TOKEN || '').trim());

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const error = params.get('error');
    const errorDescription = params.get('error_description');
    const state = params.get('state');

    if (!code && !error) {
      return;
    }

    const expectedState = window.sessionStorage.getItem('genius_oauth_state');

    setCallback({
      code,
      error,
      errorDescription,
      state,
      stateMatches: expectedState ? state === expectedState : null,
    });
  }, []);

  const startOAuth = () => {
    if (!config.clientId || !config.redirectUri || !config.scope) {
      return;
    }

    const state = createGeniusOAuthState();
    window.sessionStorage.setItem('genius_oauth_state', state);
    window.location.assign(buildGeniusAuthorizeUrl({ ...config, state }));
  };

  const missingConfig = !config.clientId || !config.redirectUri || !config.scope;

  // Hide this panel once the app already has a usable token.
  if (hasAccessToken) {
    return null;
  }

  return (
    <section className="auth-panel">
      <div className="auth-panel__copy">
        <p className="auth-panel__eyebrow">Genius connection</p>
        <h2>Authorize Genius access</h2>
        <p>
          Send the user to Genius&apos; authorization page to get a temporary code.
          Your backend must exchange that code for the access token used by search.
        </p>
      </div>

      <button className="auth-panel__button" onClick={startOAuth} disabled={missingConfig}>
        Connect Genius
      </button>

      {missingConfig && (
        <p className="auth-panel__note">
          Set VITE_GENIUS_CLIENT_ID, VITE_GENIUS_REDIRECT_URI, and VITE_GENIUS_SCOPE before connecting.
        </p>
      )}

      {callback && (
        <div className="auth-panel__callback" aria-live="polite">
          {callback.error ? (
            <p>Authorization failed: {callback.errorDescription || callback.error}.</p>
          ) : (
            <>
              <p>Authorization code received.</p>
              <p className="auth-panel__code">{callback.code}</p>
            </>
          )}
          {callback.stateMatches === false && (
            <p className="auth-panel__warning">State mismatch detected. Restart the flow.</p>
          )}
          {callback.stateMatches === true && (
            <p className="auth-panel__note">State verified.</p>
          )}
        </div>
      )}
    </section>
  );
}

export default GeniusConnect;