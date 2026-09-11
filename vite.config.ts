import { defineConfig, type ProxyOptions } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Proxy to the API on :8000 so the browser stays on one origin in development
 * and CORS never applies.
 *
 * The error handler matters: when the backend is not running, Vite's default is
 * a bare 500, which is indistinguishable from the API itself throwing. Emitting
 * 503 with the same `detail` shape the API uses lets the client say "the
 * backend is not running" instead of "Internal Server Error" - and matches what
 * a real deployment behind a proxy would return.
 */
const apiProxy: ProxyOptions = {
  target: 'http://localhost:8000',
  changeOrigin: true,
  configure: (proxy) => {
    proxy.on('error', (_error, _request, response) => {
      const target = response as unknown as {
        writeHead?: (code: number, headers: Record<string, string>) => void
        end?: (body: string) => void
      }
      if (typeof target.writeHead !== 'function' || typeof target.end !== 'function') return
      target.writeHead(503, { 'content-type': 'application/json' })
      target.end(
        JSON.stringify({
          detail:
            'Cannot reach the EvalLens API. Is the backend running on port 8000?',
        }),
      )
    })
  },
}

const proxy = { '/api': apiProxy, '/health': apiProxy }

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: true, proxy },
  preview: { port: 4173, proxy },
})
