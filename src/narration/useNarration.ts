import { useEffect, useRef, useState } from 'react'
import type { Stop } from '@/itinerary'
import { stopNumber } from '@/itinerary/poems'
import {
  findChineseVoice,
  playClips,
  preloadVoices,
  speakLines,
  unlockSpeech,
} from './engines'
import type { NarrationCallbacks, NarrationRun } from './engines'
import { clipUrl } from './request'

export type NarrationStatus = 'idle' | 'loading' | 'playing' | 'unavailable'
export type NarrationNotice = 'started' | 'stopped' | 'finished' | 'unavailable'

type NarrationState = {
  status: NarrationStatus
  line: number | null
  notice: NarrationNotice | null
}

export function useNarration(stop: Stop) {
  const [state, setState] = useState<NarrationState>({
    status: 'idle',
    line: null,
    notice: null,
  })
  // Each press starts a new run. Callbacks from an earlier run, such as a late speech
  // event or a voice lookup that resolves after a stop, check this and do nothing.
  const run = useRef(0)
  const active = useRef<NarrationRun | null>(null)
  const audio = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    preloadVoices()
    return () => {
      run.current++
      active.current?.stop()
      active.current = null
    }
  }, [])

  const end = (status: NarrationStatus, notice: NarrationNotice) => {
    active.current?.stop()
    active.current = null
    setState({ status, line: null, notice })
  }

  // Must run inside the press itself: iOS allows audio and speech only from a tap.
  const toggle = () => {
    if (state.status === 'loading' || state.status === 'playing') {
      run.current++
      end('idle', 'stopped')
      return
    }

    const token = ++run.current
    const live = () => token === run.current
    const lines = stop.properties['poem-notable-zh-cn'] ?? []
    let started = false

    const callbacks = (isFallback: boolean): NarrationCallbacks => ({
      onLine: (line) => {
        if (!live()) return
        started = true
        setState({ status: 'playing', line, notice: 'started' })
      },
      onEnd: () => {
        if (live()) end('idle', 'finished')
      },
      onError: () => {
        if (!live()) return
        active.current = null
        if (started || isFallback) return end('idle', 'stopped')
        findChineseVoice().then((voice) => {
          if (!live()) return
          if (!voice) return end('unavailable', 'unavailable')
          active.current = speakLines(lines, voice, callbacks(true))
        })
      },
    })

    audio.current ??= new Audio()
    unlockSpeech()
    setState({ status: 'loading', line: null, notice: null })
    const urls = lines.map((_, line) => clipUrl(stopNumber(stop), line))
    active.current = playClips(audio.current, urls, callbacks(false))
  }

  return { ...state, toggle }
}
