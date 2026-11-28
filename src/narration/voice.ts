// The Azure voice that narrates the poems. Retune these after listening in Speech Studio.
export const VOICE = {
  name: 'zh-CN-XiaoxiaoNeural',
  style: 'poetry-reading',
  rate: '-12%',
  pauseMs: 700,
  outputFormat: 'audio-24khz-48kbitrate-mono-mp3',
} as const

// Clip URLs carry this so the CDN fetches fresh audio after any value above changes. Bump it with them.
export const VOICE_VERSION = '1'
