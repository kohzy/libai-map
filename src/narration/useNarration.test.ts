import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { stops } from '@/itinerary'
import {
  chineseVoice,
  englishVoice,
  FakeAudio,
  flush,
  installFakes,
} from '@/test/narrationFakes'
import { clipUrl } from './request'
import { useNarration } from './useNarration'

// Stop 4 has a four-line poem.
const stop = stops[3]

let fakes: ReturnType<typeof installFakes>
beforeEach(() => {
  fakes = installFakes()
})
afterEach(() => {
  vi.unstubAllGlobals()
})

// Presses play. The first clip has not started until the test flushes.
function press() {
  const hook = renderHook(() => useNarration(stop))
  act(() => hook.result.current.toggle())
  return { hook, audio: FakeAudio.instances[0] }
}

async function start() {
  const started = press()
  await act(flush)
  return started
}

describe('useNarration', () => {
  it('narrates the poem from the cloud voice and returns to idle at the end', async () => {
    const { hook, audio } = await start()
    expect(audio.sources[0]).toBe(clipUrl(4, 0))
    expect(hook.result.current).toMatchObject({
      status: 'playing',
      line: 0,
      notice: 'started',
    })
    for (let i = 1; i < 4; i++) {
      act(() => audio.end())
      await act(flush)
    }
    expect(hook.result.current.line).toBe(3)
    act(() => audio.end())
    expect(hook.result.current).toMatchObject({
      status: 'idle',
      line: null,
      notice: 'finished',
    })
  })

  it('stops on the second press', async () => {
    const { hook, audio } = await start()
    act(() => hook.result.current.toggle())
    expect(audio.pause).toHaveBeenCalled()
    expect(hook.result.current).toMatchObject({
      status: 'idle',
      line: null,
      notice: 'stopped',
    })
  })

  it('falls back to the browser Chinese voice when the first clip fails', async () => {
    fakes.speech.voices = [chineseVoice]
    const { hook, audio } = press()
    expect(hook.result.current.status).toBe('loading')
    act(() => audio.fail())
    await act(flush)
    const lines = fakes.speech.lines()
    expect(lines.map((u) => u.text)).toEqual(
      stop.properties['poem-notable-zh-cn']
    )
    act(() => lines[0].onstart?.())
    expect(hook.result.current).toMatchObject({ status: 'playing', line: 0 })
  })

  it('falls back once Chrome loads its voices late', async () => {
    const { hook, audio } = press()
    act(() => audio.fail())
    act(() => fakes.speech.loadVoices([englishVoice, chineseVoice]))
    await act(flush)
    act(() => fakes.speech.lines()[0].onstart?.())
    expect(hook.result.current).toMatchObject({ status: 'playing', line: 0 })
  })

  it('reports narration unavailable when there is no Chinese voice either', async () => {
    fakes.speech.voices = [englishVoice]
    const { hook, audio } = press()
    act(() => audio.fail())
    await act(flush)
    expect(hook.result.current).toMatchObject({
      status: 'unavailable',
      notice: 'unavailable',
    })
    expect(fakes.speech.lines()).toEqual([])
  })

  it('ends narration when a later line fails, without switching voices', async () => {
    fakes.speech.voices = [chineseVoice]
    const { hook, audio } = await start()
    act(() => audio.end())
    await act(flush)
    act(() => audio.fail())
    await act(flush)
    expect(hook.result.current).toMatchObject({ status: 'idle', line: null })
    expect(fakes.speech.lines()).toEqual([])
  })

  it('ignores a fallback that resolves after narration was stopped', async () => {
    const { hook, audio } = press()
    act(() => audio.fail())
    act(() => hook.result.current.toggle())
    act(() => fakes.speech.loadVoices([chineseVoice]))
    await act(flush)
    expect(fakes.speech.lines()).toEqual([])
    expect(hook.result.current.status).toBe('idle')
  })

  it('unlocks speech inside the press', () => {
    press()
    expect(fakes.speech.spoken[0].text).toBe('')
  })

  it('stops playback when the reader unmounts', async () => {
    const { hook, audio } = await start()
    hook.unmount()
    expect(audio.pause).toHaveBeenCalled()
  })
})
