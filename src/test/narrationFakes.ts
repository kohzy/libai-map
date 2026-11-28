import { vi } from 'vitest'

// Stand-ins for the media and speech APIs jsdom lacks, driven by the tests.

export class FakeAudio extends EventTarget {
  static instances: FakeAudio[] = []
  src = ''
  sources: string[] = []
  playResult: () => Promise<void> = () => Promise.resolve()
  play = vi.fn(() => {
    this.sources.push(this.src)
    return this.playResult()
  })
  pause = vi.fn()
  load = vi.fn()

  constructor() {
    super()
    FakeAudio.instances.push(this)
  }

  removeAttribute(name: string) {
    if (name === 'src') this.src = ''
  }

  end() {
    this.dispatchEvent(new Event('ended'))
  }

  fail() {
    this.dispatchEvent(new Event('error'))
  }
}

export class FakeUtterance {
  lang = ''
  rate = 1
  voice: SpeechSynthesisVoice | null = null
  onstart: (() => void) | null = null
  onend: (() => void) | null = null
  onerror: ((event: { error: string }) => void) | null = null
  constructor(public text: string) {}
}

export class FakeSpeech extends EventTarget {
  voices: SpeechSynthesisVoice[] = []
  spoken: FakeUtterance[] = []
  getVoices = vi.fn(() => this.voices)
  speak = vi.fn((utterance: FakeUtterance) => {
    this.spoken.push(utterance)
  })
  cancel = vi.fn()

  // Lines queued by narration, leaving out the empty utterance that unlocks speech.
  lines() {
    return this.spoken.filter((u) => u.text !== '')
  }

  loadVoices(voices: SpeechSynthesisVoice[]) {
    this.voices = voices
    this.dispatchEvent(new Event('voiceschanged'))
  }
}

export const chineseVoice = {
  lang: 'zh-CN',
  name: 'Tingting',
} as SpeechSynthesisVoice
export const englishVoice = {
  lang: 'en-US',
  name: 'Samantha',
} as SpeechSynthesisVoice

export function installFakes() {
  FakeAudio.instances = []
  const speech = new FakeSpeech()
  const fetchMock = vi.fn(() => Promise.resolve(new Response()))
  vi.stubGlobal('Audio', FakeAudio)
  vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance)
  vi.stubGlobal('speechSynthesis', speech)
  vi.stubGlobal('fetch', fetchMock)
  return { speech, fetchMock }
}

export const flush = () => new Promise((resolve) => setTimeout(resolve, 0))
