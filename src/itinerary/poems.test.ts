import { describe, expect, it } from 'vitest'
import { stops } from './index'
import {
  age,
  decadeGroups,
  groupOf,
  linesOf,
  placeName,
  poemInfo,
  poemStops,
} from './poems'

describe('poemStops', () => {
  it('lists the 16 stops with a poem, in journey order', () => {
    const list = poemStops()
    expect(list).toHaveLength(16)
    expect(list[0]).toBe(3)
    expect(list[list.length - 1]).toBe(38)
    expect([...list].sort((a, b) => a - b)).toEqual(list)
  })
})

describe('placeName and poemInfo', () => {
  it('uses the historic name before the bracketed Chinese', () => {
    expect(placeName(stops[13])).toBe('Yangzhou')
    expect(placeName(stops[3])).toBe('Whitewater Temple')
  })

  it('describes a poem by year, place, stop and age', () => {
    expect(poemInfo(stops[13])).toBe('726 in Yangzhou, stop 14, age 25')
    expect(age(stops[0])).toBe(0)
  })
})

describe('decadeGroups', () => {
  it('groups all 39 stops by decade in order', () => {
    const groups = decadeGroups()
    expect(groups.map((g) => g.label)).toEqual([
      '700s',
      '710s',
      '720s',
      '730s',
      '740s',
      '750s',
      '760s',
    ])
    expect(groups.reduce((sum, g) => sum + g.indices.length, 0)).toBe(39)
    expect(groups[0].indices).toEqual([0, 1])
  })
})

describe('line pairing', () => {
  const handPaired = new Set([4, 28, 29, 33])

  it('pairs lines one to one where both languages have the same line count', () => {
    for (const i of poemStops()) {
      if (handPaired.has(i + 1)) continue
      const stop = stops[i]
      const zh = stop.properties['poem-notable-zh-cn']!
      const en = stop.properties['poem-trans-hajin-en']!
      expect(zh.length, `stop ${i + 1}`).toBe(en.length)
      zh.forEach((_, line) => {
        expect(groupOf(stop, 'zh', line)).toBe(line)
        expect(groupOf(stop, 'en', line)).toBe(line)
      })
    }
  })

  it('covers every line of the hand-paired poems, with matching groups on both sides', () => {
    for (const n of handPaired) {
      const stop = stops[n - 1]
      const zh = stop.properties['poem-notable-zh-cn']!
      const en = stop.properties['poem-trans-hajin-en']!
      const zhGroups = new Set(zh.map((_, line) => groupOf(stop, 'zh', line)))
      const enGroups = new Set(en.map((_, line) => groupOf(stop, 'en', line)))
      expect(zhGroups, `stop ${n}`).toEqual(enGroups)
    }
  })

  it('joins stop 33’s two short opening lines to the first English line', () => {
    const stop = stops[32]
    expect(groupOf(stop, 'zh', 0)).toBe(0)
    expect(groupOf(stop, 'zh', 1)).toBe(0)
    expect(linesOf(stop, 'en', 0)).toEqual([0])
    expect(linesOf(stop, 'zh', 0)).toEqual([0, 1])
  })

  it('maps stop 28’s second Chinese line to three English lines', () => {
    expect(linesOf(stops[27], 'en', groupOf(stops[27], 'zh', 1))).toEqual([
      1, 2, 3,
    ])
  })
})
