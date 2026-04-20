export default async function handler(req, res) {
  const geniusToken = process.env.GENIUS_ACCESS_TOKEN;
  const baseUrl = 'https://api.genius.com';

  if (!geniusToken) {
    res.status(500).json({
      error: 'GENIUS_ACCESS_TOKEN is not configured on this deployment.',
    });
    return;
  }

  const { geniusPath, ...query } = req.query;
  const pathSegments = Array.isArray(geniusPath)
    ? geniusPath
    : geniusPath
      ? [geniusPath]
      : [];

  const endpointPath = `/${pathSegments.join('/')}`;
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
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

  try {
    const response = await fetch(targetUrl, {
      headers: { Authorization: `Bearer ${geniusToken}` },
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(502).json({
      error: error instanceof Error ? error.message : 'Failed to contact Genius API.',
    });
  }
}