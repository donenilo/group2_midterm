import { createHash } from 'node:crypto';

export default async function handler(req, res) {
  const debugEnabled = String(req.query?.debug ?? '') === '1';
  // Trim accidental wrapping quotes from env vars as a precaution (common in copying/pasting).
  const geniusToken = (process.env.GENIUS_ACCESS_TOKEN || '')
    .trim()
    .replace(/^['"]|['"]$/g, '');
  const baseUrl = 'https://api.genius.com';
  const debugInfo = debugEnabled
    ? {
      handler: 'api/genius/[...geniusPath].js',
      tokenPresent: Boolean(geniusToken),
      tokenLength: geniusToken.length,
      tokenFingerprint: geniusToken
        ? createHash('sha256').update(geniusToken).digest('hex').slice(0, 12)
        : null,
      vercelEnv: process.env.VERCEL_ENV ?? null,
      nodeEnv: process.env.NODE_ENV ?? null,
    }
    : null;

 // Error handling for missing token, which is required to proxy requests to the Genius API.
  if (!geniusToken) {
    res.status(500).json({
      error: 'GENIUS_ACCESS_TOKEN is not configured on this deployment.',
      ...(debugEnabled ? { _debug: debugInfo } : {}),
    });
    return;
  }

  // Vercel may expose catch-all parameters with slightly different keys.
  const rawPath = req.query?.geniusPath
    ?? req.query?.['...geniusPath']
    ?? req.query?.['[...geniusPath]'];

  const pathSegments = Array.isArray(rawPath)
    ? rawPath
    : rawPath
      ? [rawPath]
      : [];

  const endpointPath = `/${pathSegments.join('/')}`;
  const params = new URLSearchParams();

  // Forward all query parameters except route/debug internals.
  Object.entries(req.query || {}).forEach(([key, value]) => {
    if (key === 'geniusPath' || key === '...geniusPath' || key === '[...geniusPath]' || key === 'debug') {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, String(v)));
      return;
    }
    if (value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  });

  const queryString = params.toString();
  const targetUrl = `${baseUrl}${endpointPath}${queryString ? `?${queryString}` : ''}`;

  if (debugEnabled && debugInfo) {
    // Include resolved upstream URL only in debug mode.
    debugInfo.targetUrl = targetUrl;
  }

  try {
    const response = await fetch(targetUrl, {
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