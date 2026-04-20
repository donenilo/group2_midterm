const GENIUS_AUTHORIZE_URL = "https://api.genius.com/oauth/authorize";

export function getGeniusOAuthConfig() {
  return {
    clientId: import.meta.env.VITE_GENIUS_CLIENT_ID?.trim() ?? "",
    redirectUri: import.meta.env.VITE_GENIUS_REDIRECT_URI?.trim() ?? `${window.location.origin}/`,
    scope: import.meta.env.VITE_GENIUS_SCOPE?.trim() ?? "",
  };
}

export function createGeniusOAuthState() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function buildGeniusAuthorizeUrl({ clientId, redirectUri, scope, state }) {
  const url = new URL(GENIUS_AUTHORIZE_URL);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", scope);
  url.searchParams.set("state", state);
  url.searchParams.set("response_type", "code");
  return url.toString();
}