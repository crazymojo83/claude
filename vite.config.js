import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev-only middleware that proxies /zendesk-proxy requests to the Zendesk API,
// bypassing browser CORS restrictions.
function zendeskProxyPlugin() {
  return {
    name: 'zendesk-cors-proxy',
    configureServer(server) {
      server.middlewares.use('/zendesk-proxy', async (req, res) => {
        const targetUrl = new URL(req.url, 'http://localhost').searchParams.get('url')
        if (!targetUrl) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Missing ?url= parameter' }))
          return
        }

        try {
          const headers = { 'Content-Type': 'application/json' }
          if (req.headers.authorization) {
            headers['Authorization'] = req.headers.authorization
          }

          const response = await fetch(targetUrl, { method: req.method || 'GET', headers })

          // Forward rate-limit headers
          const fwdHeaders = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
          for (const h of ['x-rate-limit', 'x-rate-limit-remaining', 'retry-after']) {
            if (response.headers.get(h)) fwdHeaders[h] = response.headers.get(h)
          }

          const body = await response.text()
          res.writeHead(response.status, fwdHeaders)
          res.end(body)
        } catch (err) {
          res.writeHead(502, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: `Proxy error: ${err.message}` }))
        }
      })
    },
  }
}

export default defineConfig({
  base: '/',
  plugins: [react(), zendeskProxyPlugin()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.js',
  },
})
