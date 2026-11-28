import { afterEach, describe, expect, it, vi } from 'vitest'
import { handleNarration } from './handler'
import { narrationSsml } from './request'
import { VOICE, VOICE_VERSION } from './voice'

const env = { AZURE_SPEECH_KEY: 'test-key', AZURE_SPEECH_REGION: 'eastasia' }
const request = (query: string) =>
  new Request(`https://libai.example/api/narrate?${query}`)
const canonical = `stop=4&line=0&v=${VOICE_VERSION}`

function stubAzure(response: Response) {
  const fetchMock = vi.fn(async () => response)
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('narration handler', () => {
  it('synthesizes a known line with Azure and returns cacheable audio', async () => {
    const fetchMock = stubAzure(new Response(new Uint8Array([1, 2, 3])))
    const response = await handleNarration(request(canonical), env)

    expect(fetchMock).toHaveBeenCalledOnce()
    const [url, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ]
    expect(url).toBe(
      'https://eastasia.tts.speech.microsoft.com/cognitiveservices/v1'
    )
    expect(init.method).toBe('POST')
    expect(init.headers).toMatchObject({
      'Ocp-Apim-Subscription-Key': 'test-key',
      'X-Microsoft-OutputFormat': VOICE.outputFormat,
    })
    expect(init.body).toBe(narrationSsml('蜀僧抱绿绮,西下峨眉峰。'))

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('audio/mpeg')
    expect(response.headers.get('Cache-Control')).toBe(
      'public, max-age=86400, s-maxage=31536000, immutable'
    )
    expect(new Uint8Array(await response.arrayBuffer())).toEqual(
      new Uint8Array([1, 2, 3])
    )
  })

  it.each([
    ['a line past the end of the poem', `stop=4&line=4&v=${VOICE_VERSION}`],
    ['a stop without a poem', `stop=1&line=0&v=${VOICE_VERSION}`],
    ['a non-numeric line', `stop=4&line=x&v=${VOICE_VERSION}`],
    ['a missing line', `stop=4&v=${VOICE_VERSION}`],
    ['a stale voice version', 'stop=4&line=0&v=0'],
    ['a random voice version', 'stop=4&line=0&v=abc123'],
    ['a missing voice version', 'stop=4&line=0'],
    ['extra text to speak', `${canonical}&text=hello`],
    ['a cache-busting extra parameter', `${canonical}&x=1`],
    ['a repeated parameter', `${canonical}&line=1`],
    ['a zero-padded stop', `stop=04&line=0&v=${VOICE_VERSION}`],
    ['a zero-padded line', `stop=4&line=00&v=${VOICE_VERSION}`],
    ['reordered parameters', `line=0&stop=4&v=${VOICE_VERSION}`],
    ['a percent-encoded value', `stop=%34&line=0&v=${VOICE_VERSION}`],
    ['a percent-encoded key', `%73top=4&line=0&v=${VOICE_VERSION}`],
  ])('rejects %s without calling Azure', async (_, query) => {
    const fetchMock = stubAzure(new Response('unused'))
    const response = await handleNarration(request(query), env)
    expect(response.status).toBe(400)
    expect(response.headers.get('Cache-Control')).toBe('no-store')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('answers 503 without calling Azure when the key or region is missing', async () => {
    const fetchMock = stubAzure(new Response('unused'))
    for (const partial of [
      {},
      { AZURE_SPEECH_KEY: 'test-key' },
      { AZURE_SPEECH_REGION: 'eastasia' },
    ]) {
      const response = await handleNarration(request(canonical), partial)
      expect(response.status).toBe(503)
      expect(response.headers.get('Cache-Control')).toBe('no-store')
    }
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it.each([401, 429])(
    'turns an Azure %i into an uncached 502',
    async (status) => {
      vi.spyOn(console, 'error').mockImplementation(() => {})
      stubAzure(new Response('quota detail', { status }))
      const response = await handleNarration(request(canonical), env)
      expect(response.status).toBe(502)
      expect(response.headers.get('Cache-Control')).toBe('no-store')
      expect(await response.text()).not.toContain('quota detail')
    }
  )
})
