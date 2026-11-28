import { stops } from './index'
import type { Stop } from './types'

export type PoemLanguage = 'zh' | 'en'

const BIRTH_YEAR = 701

// Hand-paired where Ha Jin's translation splits or merges lines; every other poem pairs one to one.
const LINE_GROUPS: Record<number, Record<PoemLanguage, number[]>> = {
  4: { zh: [0, 1, 2, 3], en: [0, 0, 1, 1, 2, 2, 2, 3, 3, 3] },
  28: { zh: [0, 1, 2, 3, 4, 5, 6], en: [0, 1, 1, 1, 2, 2, 3, 4, 5, 5, 6] },
  29: { zh: [0, 1, 2, 3, 4, 5, 6, 7], en: [0, 1, 1, 2, 3, 3, 4, 5, 6, 7] },
  33: { zh: [0, 0, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], en: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
}

export function stopNumber(stop: Stop): number {
  return stops.indexOf(stop) + 1
}

export function age(stop: Stop): number {
  return stop.properties.year - BIRTH_YEAR
}

export function placeName(stop: Stop): string {
  return stop.properties['historic-name'].split(' (')[0]
}

export function hasPoem(stop: Stop): boolean {
  return Boolean(stop.properties['poem-notable-zh-cn']?.length)
}

export function poemStops(): number[] {
  return stops.flatMap((stop, i) => (hasPoem(stop) ? [i] : []))
}

export function poemInfo(stop: Stop): string {
  return `${stop.properties.year} in ${placeName(stop)}, stop ${stopNumber(stop)}, age ${age(stop)}`
}

export type DecadeGroup = { label: string; indices: number[] }

export function decadeGroups(): DecadeGroup[] {
  const groups: DecadeGroup[] = []
  stops.forEach((stop, i) => {
    const label = `${Math.floor(stop.properties.year / 10) * 10}s`
    const last = groups[groups.length - 1]
    if (last?.label === label) last.indices.push(i)
    else groups.push({ label, indices: [i] })
  })
  return groups
}

export function groupOf(stop: Stop, lang: PoemLanguage, line: number): number {
  const groups = LINE_GROUPS[stopNumber(stop)]
  return groups ? groups[lang][line] : line
}

export function linesOf(stop: Stop, lang: PoemLanguage, group: number): number[] {
  const lines = lang === 'zh' ? stop.properties['poem-notable-zh-cn'] : stop.properties['poem-trans-hajin-en']
  return (lines ?? []).flatMap((_, line) => (groupOf(stop, lang, line) === group ? [line] : []))
}
