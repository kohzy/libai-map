import { handleNarration } from '../src/narration/handler.js'

// Vercel serves this at /api/narrate. The Azure key stays here, on the server.
export function GET(request: Request): Promise<Response> {
  return handleNarration(request, process.env)
}
