// This API route serves as a proxy to the Genius API, allowing us to keep the access token secure on the server side.
// The following import is used to create a hash fingerprint of the token for debugging purposes without exposing the actual token value.
import { createHash } from 'node:crypto';

export default async function handler(req, res) {
  const { q, id, path, per_page, page } = req.query;
  const debugEnabled = String(req.query?.debug ?? '') === '1';

  // Trim accidental wrapping quotes from env vars (common in dashboard copy/paste).
  const geniusToken = (process.env.GENIUS_ACCESS_TOKEN || '')
    .trim()
    .replace(/^['"]|['"]$/g, '');
  const baseUrl = 'https://api.genius.com';
  const debugInfo = debugEnabled
    ? {
      handler: 'api/genius.js',
      tokenPresent: Boolean(geniusToken),
      tokenLength: geniusToken.length,
      tokenFingerprint: geniusToken
        ? createHash('sha256').update(geniusToken).digest('hex').slice(0, 12)
        : null,
      vercelEnv: process.env.VERCEL_ENV ?? null,
      nodeEnv: process.env.NODE_ENV ?? null,
    }
    : null;

  let url;
  // Support song-by-id, arbitrary Genius path proxying, or search endpoint.
  if (id) {
    url = `${baseUrl}/songs/${id}`;
  } else if (path) {
    url = `${baseUrl}${path}`;
  } else {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (per_page) params.set('per_page', per_page);
    if (page) params.set('page', page);
    url = `${baseUrl}/search?${params.toString()}`;
  }

  if (!geniusToken) {
    res.status(500).json({
      error: 'GENIUS_ACCESS_TOKEN is not configured on this deployment.',
      ...(debugEnabled ? { _debug: debugInfo } : {}),
    });
    return;
  }

  if (debugEnabled && debugInfo) {
    // Include resolved upstream URL only in debug mode.
    debugInfo.targetUrl = url;
  }

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${geniusToken}` },
    });

    const contentType = response.headers.get('content-type') || '';
    // Normalize non-JSON responses into JSON for consistent frontend handling.
    const payload = contentType.includes('application/json')
      ? await response.json()
      : { error: await response.text() };

    const responseBody = debugEnabled
      ? {
        ...(payload && typeof payload === 'object' && !Array.isArray(payload) ? payload : { data: payload }),
        _debug: debugInfo,
      }
      : payload;

    res.status(response.status).json(responseBody);
  } catch (error) {
    res.status(502).json({
      error: error instanceof Error ? error.message : 'Failed to contact Genius API.',
      ...(debugEnabled ? { _debug: debugInfo } : {}),
    });
  }
}