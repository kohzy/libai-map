// The narration function imports this module, so it reads the data by relative path and
// avoids the app's `@/` alias, the itinerary module and extensionless imports.
import data from '../data/libai-stop.json' with { type: 'json' }
import { VOICE, VOICE_VERSION } from './voice.js'

type PoemFeature = { properties: { 'poem-notable-zh-cn'?: string[] } }

const features: PoemFeature[] = data.features

// Stop numbers count from 1, as the reader shows them.
export function narrationLine(stop: number, line: number): string | null {
  if (!Number.isInteger(stop) || !Number.isInteger(line) || line < 0)
    return null
  return features[stop - 1]?.properties['poem-notable-zh-cn']?.[line] ?? null
}

function escapeXml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

export function narrationSsml(text: string): string {
  return (
    '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" ' +
    'xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="zh-CN">' +
    `<voice name="${VOICE.name}">` +
    `<mstts:express-as style="${VOICE.style}">` +
    `<prosody rate="${VOICE.rate}">${escapeXml(text)}</prosody>` +
    '</mstts:express-as>' +
    `<break time="${VOICE.pauseMs}ms"/>` +
    '</voice></speak>'
  )
}

export function clipUrl(stop: number, line: number): string {
  return `/api/narrate?stop=${stop}&line=${line}&v=${VOICE_VERSION}`
}
