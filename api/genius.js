export default async function handler(req, res) {
  const { q, id, path, per_page, page } = req.query;

  const geniusToken = (process.env.GENIUS_ACCESS_TOKEN || '')
    .trim()
    .replace(/^['\"]|['\"]$/g, '');
  const baseUrl = 'https://api.genius.com';

  let url;
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
    });
    return;
  }

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${geniusToken}` },
    });

    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json')
      ? await response.json()
      : { error: await response.text() };

    res.status(response.status).json(payload);
  } catch (error) {
    res.status(502).json({
      error: error instanceof Error ? error.message : 'Failed to contact Genius API.',
    });
  }
}