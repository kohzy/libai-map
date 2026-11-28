export type NarrationCallbacks = {
  onLine: (line: number) => void
  onEnd: () => void
  onError: (line: number) => void
}

export type NarrationRun = { stop: () => void }

// Plays one clip per line through a single element. iOS lets only the element a tap
// started keep playing, so the caller creates it and this swaps its source per line.
export function playClips(
  audio: HTMLAudioElement,
  urls: string[],
  { onLine, onEnd, onError }: NarrationCallbacks
): NarrationRun {
  let current = 0
  let done = false
  const prefetch = new AbortController()

  const finish = () => {
    done = true
    audio.removeEventListener('ended', onEnded)
    audio.removeEventListener('error', onFailed)
    prefetch.abort()
  }
  function onFailed() {
    if (done) return
    finish()
    onError(current)
  }
  function onEnded() {
    if (current + 1 < urls.length) return play(current + 1)
    finish()
    onEnd()
  }
  function play(line: number) {
    current = line
    audio.src = urls[line]
    audio.play().then(() => {
      if (!done) onLine(line)
    }, onFailed)
    const next = urls[line + 1]
    // Warms the browser cache so the next line starts without a gap.
    if (next) fetch(next, { signal: prefetch.signal }).catch(() => {})
  }

  audio.addEventListener('ended', onEnded)
  audio.addEventListener('error', onFailed)
  play(0)

  return {
    stop() {
      if (done) return
      finish()
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
    },
  }
}

function speech(): SpeechSynthesis | null {
  return typeof speechSynthesis === 'undefined' ? null : speechSynthesis
}

export function speakLines(
  lines: string[],
  voice: SpeechSynthesisVoice,
  { onLine, onEnd, onError }: NarrationCallbacks
): NarrationRun {
  const synth = speech()
  let done = false
  lines.forEach((text, line) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-CN'
    utterance.voice = voice
    utterance.rate = 0.8
    utterance.onstart = () => {
      if (!done) onLine(line)
    }
    utterance.onerror = (event) => {
      if (done || event.error === 'interrupted' || event.error === 'canceled')
        return
      done = true
      synth?.cancel()
      onError(line)
    }
    if (line === lines.length - 1)
      utterance.onend = () => {
        if (done) return
        done = true
        onEnd()
      }
    synth?.speak(utterance)
  })
  return {
    stop() {
      if (done) return
      done = true
      synth?.cancel()
    },
  }
}

function pickChinese(voices: SpeechSynthesisVoice[]) {
  const lang = (v: SpeechSynthesisVoice) => v.lang.toLowerCase()
  return (
    voices.find((v) => lang(v) === 'zh-cn') ??
    voices.find((v) => lang(v).startsWith('zh')) ??
    null
  )
}

// Chrome fills the voice list lazily, so an empty list waits briefly for it to load.
export function findChineseVoice(
  waitMs = 1000
): Promise<SpeechSynthesisVoice | null> {
  const synth = speech()
  if (!synth) return Promise.resolve(null)
  if (synth.getVoices().length)
    return Promise.resolve(pickChinese(synth.getVoices()))
  return new Promise((resolve) => {
    const settle = () => {
      clearTimeout(timer)
      synth.removeEventListener('voiceschanged', settle)
      resolve(pickChinese(synth.getVoices()))
    }
    const timer = setTimeout(settle, waitMs)
    synth.addEventListener('voiceschanged', settle)
  })
}

export function preloadVoices() {
  speech()?.getVoices()
}

// iOS speaks only after a tap has spoken once, so the tap that starts narration
// speaks an empty line in case the fallback voice is needed later.
export function unlockSpeech() {
  speech()?.speak(new SpeechSynthesisUtterance(''))
}
