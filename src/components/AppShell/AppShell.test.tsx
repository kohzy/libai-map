import { fireEvent, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/test/renderApp'
import { viewport } from '@/test/setup'

describe('app shell', () => {
  it('uses the resizable panel on desktop and no sheet', () => {
    const { screen } = renderApp()
    expect(
      screen.getByRole('separator', { name: 'Resize the stop panel' })
    ).toBeTruthy()
    expect(document.querySelector('[data-slot="drawer-content"]')).toBeNull()
  })

  it('uses a bottom sheet with the same tabs on phones', () => {
    viewport.phone = true
    const { screen } = renderApp()
    const sheet = document.querySelector<HTMLElement>(
      '[data-slot="drawer-content"]'
    )
    expect(sheet).toBeTruthy()
    expect(within(sheet!).getByRole('tablist', { name: 'Panel' })).toBeTruthy()
    expect(
      screen.queryByRole('separator', { name: 'Resize the stop panel' })
    ).toBeNull()
  })

  it('closes the sheet while the reader is open and reopens it on Close', async () => {
    viewport.phone = true
    const { user, screen } = renderApp()
    const sheet = () =>
      document.querySelector<HTMLElement>('[data-slot="drawer-content"]')!
    await user.click(within(sheet()).getByRole('tab', { name: 'Poems' }))
    await user.click(
      within(sheet()).getByRole('button', {
        name: /Reflection in a Quiet Night/,
      })
    )

    expect(sheet().hasAttribute('data-open')).toBe(false)
    const reader = screen.getByRole('region', { name: 'Poem reader' })
    const zhLine = reader.querySelectorAll<HTMLElement>('[data-line]')[0]
    fireEvent.pointerUp(zhLine, { pointerType: 'touch' })
    expect(zhLine.hasAttribute('data-paired')).toBe(true)

    await user.click(within(reader).getByRole('button', { name: 'Close' }))
    expect(sheet().hasAttribute('data-open')).toBe(true)
    expect(
      within(sheet())
        .getByRole('tab', { name: 'Poems' })
        .getAttribute('aria-selected')
    ).toBe('true')
  })
})
