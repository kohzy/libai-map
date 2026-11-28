import { describe, expect, it } from 'vitest'
import { clipUrl, narrationLine, narrationSsml } from './request'
import { VOICE, VOICE_VERSION } from './voice'

describe('narration request', () => {
  it('looks up a Chinese line by stop number and line index', () => {
    expect(narrationLine(4, 0)).toBe('蜀僧抱绿绮,西下峨眉峰。')
    expect(narrationLine(4, 3)).toBe('不觉碧山暮,秋云暗几重。')
  })

  it('returns nothing for a stop without a poem or a line out of range', () => {
    expect(narrationLine(1, 0)).toBeNull()
    expect(narrationLine(0, 0)).toBeNull()
    expect(narrationLine(40, 0)).toBeNull()
    expect(narrationLine(4, -1)).toBeNull()
    expect(narrationLine(4, 4)).toBeNull()
    expect(narrationLine(4, 1.5)).toBeNull()
    expect(narrationLine(Number.NaN, 0)).toBeNull()
  })

  it('wraps the line in the poetry-reading voice with a slower pace and a closing pause', () => {
    const ssml = narrationSsml('床前明月光')
    expect(ssml).toContain(`<voice name="${VOICE.name}">`)
    expect(ssml).toContain(`<mstts:express-as style="${VOICE.style}">`)
    expect(ssml).toContain(`<prosody rate="${VOICE.rate}">床前明月光</prosody>`)
    expect(ssml).toMatch(/<break time="\d+ms"\/><\/voice><\/speak>$/)
  })

  it('escapes XML special characters in the line', () => {
    expect(narrationSsml('a & <b>')).toContain('a &amp; &lt;b&gt;')
  })

  it('builds the clip URL with the voice version', () => {
    expect(clipUrl(4, 2)).toBe(`/api/narrate?stop=4&line=2&v=${VOICE_VERSION}`)
  })
})
