import { handleNarration } from '../src/narration/handler.js'

export function GET(request: Request): Promise<Response> {
  return handleNarration(request, process.env)
}
