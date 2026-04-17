## MIDTERM PROJECT FOR APPLICATION DEVELOPMENT
## Group 2

- Sarah Nicole Anoso
- Sherrie Borbon
- Danilo Buenaventura
- Youone Christian Clamar
- Paulo Anriv Manalo

## Genius OAuth setup

To start the Genius authorization flow, set these environment variables in a local `.env.local` file:

- `VITE_GENIUS_CLIENT_ID`
- `VITE_GENIUS_REDIRECT_URI`
- `VITE_GENIUS_SCOPE`

The app will send the user to Genius&apos; authorization page from the Connect Genius button. The redirect URI should point back to this app, and the returned authorization code must be exchanged for an access token on a backend or serverless endpoint. Once you have that token, set `GENIUS_ACCESS_TOKEN` for the search proxy.