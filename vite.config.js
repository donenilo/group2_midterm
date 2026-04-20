/* import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
 */

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const geniusToken = (env.GENIUS_ACCESS_TOKEN || '').trim()

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/genius': {
          target: 'https://api.genius.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/genius/, ''),
          headers: {
            Authorization: `Bearer ${geniusToken}`
          }
        }
      }
    }
  }
})