import { act, fireEvent, waitFor, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { NarrationCallbacks } from '@/narration/engines'
import { openStop, renderApp } from '@/test/renderApp'

// jsdom cannot play audio, so the tests drive narration line by line.
const engine = vi.hoisted(() => ({
  callbacks: null as NarrationCallbacks | null,
  stop: vi.fn(),
}))
vi.mock('@/narration/engines', () => ({
  playClips: (
    _audio: unknown,
    _urls: unknown,
    callbacks: NarrationCallbacks
  ) => {
    engine.callbacks = callbacks
    return { stop: engine.stop }
  },
  speakLines: vi.fn(),
  findChineseVoice: vi.fn(async () => null),
  preloadVoices: vi.fn(),
  unlockSpeech: vi.fn(),
}))

afterEach(() => {
  engine.callbacks = null
  engine.stop.mockClear()
  vi.restoreAllMocks()
})

async function openPoemAt(title: string) {
  const app = renderApp()
  await openStop(app.user, title)
  await app.user.click(
    app.screen.getByRole('button', { name: /Read the poem/ })
  )
  return {
    ...app,
    reader: app.screen.getByRole('region', { name: 'Poem reader' }),
  }
}

function lines(reader: HTMLElement, lang: 'zh' | 'en') {
  const zh = within(reader).getByRole('region', { name: /lines$/ })
  const all = [...reader.querySelectorAll<HTMLElement>('[data-line]')]
  return all.filter((line) =>
    lang === 'zh' ? zh.contains(line) : !zh.contains(line)
  )
}

const hover = (el: HTMLElement) =>
  fireEvent.pointerEnter(el, { pointerType: 'mouse' })

describe('poem reader', () => {
  it('shows the poem in both languages with only previous, next, Close and narration', async () => {
    const { screen, reader } = await openPoemAt(
      'Sick and Destitute in Yangzhou'
    )
    expect(
      within(reader).getByRole('heading', {
        name: 'Reflection in a Quiet Night',
      })
    ).toBeTruthy()
    expect(within(reader).getByText('静夜思')).toBeTruthy()
    expect(within(reader).getByText('Translated by Ha Jin')).toBeTruthy()
    expect(
      within(reader)
        .getAllByRole('button')
        .map((b) => b.getAttribute('aria-label') ?? b.textContent?.trim())
    ).toEqual(['Previous poem', 'Next poem', 'Close', 'Play narration'])
    expect(within(reader).queryByText(/From stop/)).toBeNull()
    expect(within(reader).queryByText(/Poem \d+ of/)).toBeNull()
    expect(screen.getByTestId('map').closest('[data-hidden]')).toBeTruthy()
  })

  it('shows the scroll hint only for poems longer than four Chinese lines', async () => {
    const first = await openPoemAt('Learning from Monk Jun at Mount Emei')
    expect(within(first.reader).queryByText(/Scroll left/)).toBeNull()
    await first.user.click(
      within(first.reader).getByRole('button', { name: 'Close' })
    )
    await openStop(first.user, 'Stop 15:')
    await first.user.click(
      first.screen.getByRole('button', { name: /Read the poem/ })
    )
    expect(first.screen.getByText('Scroll left for 4 more lines')).toBeTruthy()
  })

  it('pairs lines across languages on hover and focus', async () => {
    const { reader } = await openPoemAt('Visiting the reclusive Meng Haoran')
    const en = lines(reader, 'en')
    const zh = lines(reader, 'zh')
    hover(en[1])
    expect(zh[1].hasAttribute('data-paired')).toBe(true)
    expect(en[1].hasAttribute('data-paired')).toBe(true)
    expect(zh[0].hasAttribute('data-dimmed')).toBe(true)
  })

  it('uses the hand-paired groups for stops 33 and 28', async () => {
    const app = await openPoemAt('Withdrawing from Politics')
    fireEvent.focus(lines(app.reader, 'en')[0])
    expect(
      lines(app.reader, 'zh')
        .slice(0, 2)
        .every((l) => l.hasAttribute('data-paired'))
    ).toBe(true)
    expect(lines(app.reader, 'zh')[2].hasAttribute('data-paired')).toBe(false)

    await app.user.click(
      within(app.reader).getByRole('button', { name: 'Close' })
    )
    await openStop(app.user, 'Stop 28:')
    await app.user.click(
      app.screen.getByRole('button', { name: /Read the poem/ })
    )
    const reader = app.screen.getByRole('region', { name: 'Poem reader' })
    hover(lines(reader, 'zh')[1])
    expect(
      lines(reader, 'en').map((l) => l.hasAttribute('data-paired'))
    ).toEqual([
      false,
      true,
      true,
      true,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ])
  })

  it('steps between poems, wrapping at both ends', async () => {
    const app = await openPoemAt('Sick and Destitute in Yangzhou')
    await app.user.click(
      within(app.reader).getByRole('button', { name: 'Next poem' })
    )
    expect(
      within(app.reader).getByRole('heading', { name: 'For Meng Haoran' })
    ).toBeTruthy()

    await app.user.click(
      within(app.reader).getByRole('button', { name: 'Close' })
    )
    await openStop(app.user, 'Stop 4:')
    await app.user.click(
      app.screen.getByRole('button', { name: /Read the poem/ })
    )
    const reader = app.screen.getByRole('region', { name: 'Poem reader' })
    await app.user.click(
      within(reader).getByRole('button', { name: 'Previous poem' })
    )
    expect(
      within(reader).getByRole('heading', { name: 'The Final Song' })
    ).toBeTruthy()
  })

  it('moves focus in on open and back to the poem card on Escape, with the map back', async () => {
    const app = renderApp()
    await openStop(app.user, 'Sick and Destitute in Yangzhou')
    const card = app.screen.getByRole('button', { name: /Read the poem/ })
    await app.user.click(card)
    expect(document.activeElement?.getAttribute('aria-label')).toBe(
      'Previous poem'
    )
    const map = app.screen.getByTestId('map')

    await app.user.keyboard('{Escape}')
    expect(app.screen.queryByRole('region', { name: 'Poem reader' })).toBeNull()
    expect(app.screen.getByTestId('map')).toBe(map)
    expect(map.closest('[data-hidden]')).toBeNull()
    await waitFor(() => expect(document.activeElement).toBe(card))
  })
})

const paired = (els: HTMLElement[]) =>
  els.map((l) => l.hasAttribute('data-paired'))

async function startNarration(title: string) {
  const app = await openPoemAt(title)
  const button = within(app.reader).getByRole('button', {
    name: 'Play narration',
  })
  await app.user.click(button)
  const narrate = (line: number) => act(() => engine.callbacks?.onLine(line))
  return { ...app, button, narrate }
}

describe('poem narration', () => {
  it('swaps the audio button for a stop button and keeps focus on it', async () => {
    const { button } = await startNarration('Sick and Destitute in Yangzhou')
    expect(button.getAttribute('aria-label')).toBe('Stop narration')
    expect(button.textContent).toContain('Stop')
    expect(document.activeElement).toBe(button)
  })

  it('gives the narrated line the hover highlight in both languages', async () => {
    const { reader, narrate } = await startNarration(
      'Sick and Destitute in Yangzhou'
    )
    narrate(1)
    expect(paired(lines(reader, 'zh'))).toEqual([false, true, false, false])
    expect(paired(lines(reader, 'en'))).toEqual([false, true, false, false])
    expect(lines(reader, 'zh')[0].hasAttribute('data-dimmed')).toBe(true)
  })

  it('highlights by the hand-paired groups on stop 33', async () => {
    const { reader, narrate } = await startNarration(
      'Withdrawing from Politics'
    )
    narrate(1)
    expect(paired(lines(reader, 'zh')).slice(0, 3)).toEqual([true, true, false])
    expect(paired(lines(reader, 'en')).slice(0, 2)).toEqual([true, false])
  })

  it('lets a hover take over and gives the highlight back when it leaves', async () => {
    const { reader, narrate } = await startNarration(
      'Sick and Destitute in Yangzhou'
    )
    narrate(1)
    const en = lines(reader, 'en')
    hover(en[3])
    expect(paired(en)).toEqual([false, false, false, true])
    fireEvent.pointerLeave(en[3], { pointerType: 'mouse' })
    expect(paired(en)).toEqual([false, true, false, false])
  })

  it('does not let a mouse click pin the highlight during narration', async () => {
    const { reader, narrate, user } = await startNarration(
      'Sick and Destitute in Yangzhou'
    )
    narrate(1)
    const en = lines(reader, 'en')
    await user.click(en[3])
    fireEvent.pointerLeave(en[3], { pointerType: 'mouse' })
    expect(paired(en)).toEqual([false, true, false, false])
  })

  it('scrolls the Chinese column sideways to a later line without moving the page', async () => {
    const { reader, narrate } = await startNarration(
      'Withdrawing from Politics'
    )
    const column = within(reader).getByRole('region', { name: /lines$/ })
    const rect = (left: number, right: number) =>
      ({ left, right, top: 0, bottom: 0, width: right - left }) as DOMRect
    vi.spyOn(column, 'getBoundingClientRect').mockReturnValue(rect(0, 260))
    vi.spyOn(lines(reader, 'zh')[6], 'getBoundingClientRect').mockReturnValue(
      rect(-200, -140)
    )
    const scrollTo = vi.fn()
    column.scrollTo = scrollTo
    const scrollIntoView = vi.spyOn(Element.prototype, 'scrollIntoView')
    narrate(6)
    expect(scrollTo).toHaveBeenCalledOnce()
    expect(scrollTo.mock.calls[0][0].left).toBe(-400)
    expect(scrollIntoView).not.toHaveBeenCalled()
  })

  it('clears the highlight and returns to the audio button on stop', async () => {
    const { reader, button, narrate, user } = await startNarration(
      'Sick and Destitute in Yangzhou'
    )
    narrate(2)
    await user.click(button)
    expect(engine.stop).toHaveBeenCalled()
    expect(button.getAttribute('aria-label')).toBe('Play narration')
    expect(
      reader.querySelectorAll('[data-paired], [data-dimmed]')
    ).toHaveLength(0)
  })

  it('returns to the audio button and announces the end when the poem finishes', async () => {
    const { reader, button, narrate } = await startNarration(
      'Sick and Destitute in Yangzhou'
    )
    narrate(3)
    act(() => engine.callbacks?.onEnd())
    expect(button.getAttribute('aria-label')).toBe('Play narration')
    expect(within(reader).getByRole('status').textContent).toBe(
      'Narration finished'
    )
    expect(reader.querySelectorAll('[data-paired]')).toHaveLength(0)
  })

  it('stops narrating when the reader moves to the next poem', async () => {
    const { reader, user } = await startNarration(
      'Sick and Destitute in Yangzhou'
    )
    await user.click(within(reader).getByRole('button', { name: 'Next poem' }))
    expect(engine.stop).toHaveBeenCalled()
  })

  it('says narration is unavailable when no voice can read the poem', async () => {
    const { reader, button } = await startNarration(
      'Sick and Destitute in Yangzhou'
    )
    await act(async () => engine.callbacks?.onError(0))
    expect(button.getAttribute('aria-label')).toBe('Play narration')
    expect(within(reader).getByRole('status').textContent).toBe(
      'Narration isn’t available in this browser'
    )
  })
})
