import { fireEvent, waitFor, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { openStop, renderApp } from '@/test/renderApp'

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
  it('shows the poem in both languages with only previous, next and Close', async () => {
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
    ).toEqual(['Previous poem', 'Next poem', 'Close'])
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
