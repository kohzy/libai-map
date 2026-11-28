import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { findChineseVoice, playClips, speakLines } from './engines'
import {
  chineseVoice,
  englishVoice,
  FakeAudio,
  flush,
  installFakes,
} from '@/test/narrationFakes'

const urls = ['/a0', '/a1', '/a2', '/a3']

function callbacks() {
  return { onLine: vi.fn(), onEnd: vi.fn(), onError: vi.fn() }
}

let fakes: ReturnType<typeof installFakes>
beforeEach(() => {
  fakes = installFakes()
})
afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('playClips', () => {
  it('plays every line in order through one audio element, then ends', async () => {
    const audio = new FakeAudio()
    const cb = callbacks()
    playClips(audio as unknown as HTMLAudioElement, urls, cb)
    await flush()
    for (let i = 1; i < urls.length; i++) {
      audio.end()
      await flush()
    }
    expect(cb.onLine.mock.calls.map(([line]) => line)).toEqual([0, 1, 2, 3])
    expect(cb.onEnd).not.toHaveBeenCalled()
    audio.end()
    expect(cb.onEnd).toHaveBeenCalledOnce()
    expect(audio.sources).toEqual(urls)
    expect(FakeAudio.instances).toHaveLength(1)
  })

  it('warms the next line while the current one plays', () => {
    const audio = new FakeAudio()
    playClips(audio as unknown as HTMLAudioElement, urls, callbacks())
    expect(fakes.fetchMock).toHaveBeenCalledWith('/a1', expect.anything())
  })

  it('stops at once and reports nothing more', async () => {
    const audio = new FakeAudio()
    const cb = callbacks()
    const run = playClips(audio as unknown as HTMLAudioElement, urls, cb)
    audio.end()
    audio.end()
    await flush()
    run.stop()
    expect(audio.pause).toHaveBeenCalled()
    expect(audio.src).toBe('')
    audio.end()
    audio.fail()
    await flush()
    expect(cb.onLine.mock.calls.at(-1)).toEqual([2])
    expect(cb.onEnd).not.toHaveBeenCalled()
    expect(cb.onError).not.toHaveBeenCalled()
  })

  it('reports the line that failed to load', async () => {
    const audio = new FakeAudio()
    const cb = callbacks()
    playClips(audio as unknown as HTMLAudioElement, urls, cb)
    audio.end()
    audio.end()
    audio.fail()
    expect(cb.onError).toHaveBeenCalledWith(2)
  })

  it('reports a line whose playback is refused', async () => {
    const audio = new FakeAudio()
    audio.playResult = () => Promise.reject(new Error('NotAllowedError'))
    const cb = callbacks()
    playClips(audio as unknown as HTMLAudioElement, urls, cb)
    await flush()
    expect(cb.onError).toHaveBeenCalledWith(0)
    expect(cb.onLine).not.toHaveBeenCalled()
  })
})

describe('speakLines', () => {
  it('speaks each line in Mandarin and reports lines as they start', () => {
    const cb = callbacks()
    speakLines(['一', '二'], chineseVoice, cb)
    const [first, second] = fakes.speech.lines()
    expect(first.lang).toBe('zh-CN')
    expect(first.voice).toBe(chineseVoice)
    expect(first.rate).toBeLessThan(1)
    first.onstart?.()
    second.onstart?.()
    second.onend?.()
    expect(cb.onLine.mock.calls.map(([line]) => line)).toEqual([0, 1])
    expect(cb.onEnd).toHaveBeenCalledOnce()
  })

  it('cancels the speech queue on stop and ignores the cancellation errors', () => {
    const cb = callbacks()
    const run = speakLines(['一', '二'], chineseVoice, cb)
    run.stop()
    expect(fakes.speech.cancel).toHaveBeenCalled()
    fakes.speech.lines()[0].onerror?.({ error: 'interrupted' })
    fakes.speech.lines()[1].onstart?.()
    expect(cb.onError).not.toHaveBeenCalled()
    expect(cb.onLine).not.toHaveBeenCalled()
  })
})

describe('findChineseVoice', () => {
  it('picks a Chinese voice that is already loaded', async () => {
    fakes.speech.voices = [englishVoice, chineseVoice]
    await expect(findChineseVoice()).resolves.toBe(chineseVoice)
  })

  it('waits for voices that load late, as Chrome does', async () => {
    const pending = findChineseVoice()
    fakes.speech.loadVoices([englishVoice, chineseVoice])
    await expect(pending).resolves.toBe(chineseVoice)
  })

  it('gives up when no Chinese voice arrives', async () => {
    vi.useFakeTimers()
    const pending = findChineseVoice()
    vi.advanceTimersByTime(1000)
    await expect(pending).resolves.toBeNull()
  })

  it('has no voice without speech synthesis', async () => {
    vi.stubGlobal('speechSynthesis', undefined)
    await expect(findChineseVoice()).resolves.toBeNull()
  })
})
