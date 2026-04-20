export default async function handler(req, res) {
  const { q, id, path, per_page, page } = req.query;

  const GENIUS_TOKEN = process.env.GENIUS_ACCESS_TOKEN;
  const BASE = "https://api.genius.com";

  let url;
  if (id) {
    url = `${BASE}/songs/${id}`;
  } else if (path) {
    url = `${BASE}${path}`;
  } else {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (per_page) params.set("per_page", per_page);
    if (page) params.set("page", page);
    url = `${BASE}/search?${params.toString()}`;
  }

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${GENIUS_TOKEN}` },
  });

  const data = await response.json();
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(response.status).json(data);
}