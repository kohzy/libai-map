import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import type { Plugin } from 'vite'

// Serves /api/narrate during `npm run dev` with the same handler Vercel runs, reading the
// server-only Azure variables from .env.local so they never reach the client bundle.
function narrationDevServer(): Plugin {
  return {
    name: 'narration-dev-server',
    apply: 'serve',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), 'AZURE_')
      server.middlewares.use('/api/narrate', async (req, res, next) => {
        if (req.method !== 'GET') return next()
        try {
          const { handleNarration } = (await server.ssrLoadModule(
            '/src/narration/handler.ts'
          )) as typeof import('./src/narration/handler.ts')
          const url = new URL(req.originalUrl ?? req.url ?? '/', 'http://dev')
          const response = await handleNarration(new Request(url), env)
          res.statusCode = response.status
          response.headers.forEach((value, key) => res.setHeader(key, value))
          res.end(Buffer.from(await response.arrayBuffer()))
        } catch (error) {
          next(error)
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), narrationDevServer()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
