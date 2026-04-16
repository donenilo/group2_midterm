export default async function handler(req, res) {
  const { q, id, path } = req.query;

  const GENIUS_TOKEN = process.env.GENIUS_ACCESS_TOKEN;
  const BASE = "https://api.genius.com";

  let url;
  if (id) {
    url = `${BASE}/songs/${id}`;
  } else if (path) {
    url = `${BASE}${path}`;
  } else {
    url = `${BASE}/search?q=${encodeURIComponent(q || "")}`;
  }

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${GENIUS_TOKEN}` },
  });

  const data = await response.json();
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(response.status).json(data);
}