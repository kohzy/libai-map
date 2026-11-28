// Shared by the Vercel function and the Vite dev server, so it follows the import rules in request.ts.
import { narrationLine, narrationSsml } from './request.js'
import { VOICE, VOICE_VERSION } from './voice.js'

export type NarrationEnv = {
  AZURE_SPEECH_KEY?: string
  AZURE_SPEECH_REGION?: string
}

const PARAMS = ['stop', 'line', 'v']
const INDEX = /^\d+$/

function uncached(status: number, message: string): Response {
  return new Response(message, {
    status,
    headers: { 'Content-Type': 'text/plain', 'Cache-Control': 'no-store' },
  })
}

// Only the canonical URL for a bundled line is accepted, so the CDN holds at most one
// cached clip per line and no query string can force a fresh, billed synthesis.
function requestedText(url: URL): string | null {
  const keys = [...url.searchParams.keys()]
  if (keys.length !== PARAMS.length || !PARAMS.every((k) => keys.includes(k)))
    return null
  if (url.searchParams.get('v') !== VOICE_VERSION) return null
  const stop = url.searchParams.get('stop') ?? ''
  const line = url.searchParams.get('line') ?? ''
  if (!INDEX.test(stop) || !INDEX.test(line)) return null
  return narrationLine(Number(stop), Number(line))
}

export async function handleNarration(
  request: Request,
  env: NarrationEnv
): Promise<Response> {
  const text = requestedText(new URL(request.url))
  if (text === null) return uncached(400, 'Unknown poem line')

  const key = env.AZURE_SPEECH_KEY
  const region = env.AZURE_SPEECH_REGION
  if (!key || !region) return uncached(503, 'Narration is not configured')

  const azure = await fetch(
    `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`,
    {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': VOICE.outputFormat,
        'User-Agent': 'libai-map',
      },
      body: narrationSsml(text),
    }
  )
  if (!azure.ok) {
    console.error(
      `Azure speech returned ${azure.status}: ${await azure.text()}`
    )
    return uncached(502, 'Narration failed')
  }

  return new Response(azure.body, {
    status: 200,
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'public, max-age=86400, s-maxage=31536000, immutable',
    },
  })
}
