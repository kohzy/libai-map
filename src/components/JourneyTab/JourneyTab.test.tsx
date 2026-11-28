import { within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { openStop, renderApp } from '@/test/renderApp'

describe('stop index', () => {
  it('groups 39 stops into seven decades and marks stops with a poem', () => {
    const { screen } = renderApp()
    const nav = screen.getByRole('navigation', { name: 'Journey stops' })
    expect(
      within(nav)
        .getAllByRole('heading', { level: 2 })
        .map((h) => h.textContent)
    ).toEqual(['700s', '710s', '720s', '730s', '740s', '750s', '760s'])
    expect(within(nav).getAllByRole('button')).toHaveLength(39)
    expect(
      within(nav).getByRole('button', { name: /Learning from Monk Jun/ })
        .textContent
    ).toContain('Age 18, with a poem')
    expect(
      within(nav).getByRole('button', { name: /Birth in Suyab/ }).textContent
    ).not.toContain('with a poem')
  })
})

describe('stop view', () => {
  it('shows the stop, its details and its poem card', async () => {
    const { user, screen } = renderApp()
    await openStop(user, 'Sick and Destitute in Yangzhou')
    expect(screen.getByText('Stop 14 of 39')).toBeTruthy()
    expect(
      screen.getByRole('heading', { name: 'Sick and Destitute in Yangzhou' })
    ).toBeTruthy()
    expect(screen.getByText('Li Bai is 25')).toBeTruthy()
    expect(screen.getByRole('button', { name: /Read the poem/ })).toBeTruthy()
  })

  it('leaves out a missing companion row and never shows a photo', async () => {
    const { user, screen } = renderApp()
    await openStop(user, 'Seeking Civil Service in the Capital')
    expect(screen.queryByText('With')).toBeNull()
    await openStop(user, 'Stop 7:')
    expect(screen.getByText('Stop 7 of 39')).toBeTruthy()
    expect(screen.queryByRole('img')).toBeNull()
  })

  it('jumps along the spine by click and arrow key, with one tab stop', async () => {
    const { user, screen } = renderApp()
    await openStop(user, 'Sick and Destitute in Yangzhou')
    const spine = screen.getByRole('group', { name: 'Jump to a stop' })
    const ticks = within(spine).getAllByRole('button')
    expect(ticks).toHaveLength(39)
    expect(ticks.filter((tick) => tick.tabIndex === 0)).toHaveLength(1)

    await user.click(screen.getByRole('button', { name: /^Stop 20:/ }))
    expect(screen.getByText('Stop 20 of 39')).toBeTruthy()

    await user.keyboard('{ArrowRight}')
    expect(screen.getByText('Stop 21 of 39')).toBeTruthy()
    expect(document.activeElement?.getAttribute('aria-label')).toMatch(
      /^Stop 21:/
    )
  })

  it('steps with the toolbar, one tab stop with arrow keys', async () => {
    const { user, screen } = renderApp()
    await openStop(user, 'Sick and Destitute in Yangzhou')
    const toolbar = screen.getByRole('toolbar', { name: 'Stop navigation' })
    const buttons = within(toolbar).getAllByRole('button')
    expect(
      buttons.map((b) => b.getAttribute('aria-label') ?? b.textContent)
    ).toEqual(['All stops', 'Previous stop', 'Next stop'])

    buttons[0].focus()
    await user.keyboard('{ArrowRight}{ArrowRight}')
    expect(document.activeElement).toBe(buttons[2])
    await user.keyboard('{Enter}')
    expect(screen.getByText('Stop 15 of 39')).toBeTruthy()
  })

  it('returns to the index with the current stop marked', async () => {
    const { user, screen } = renderApp()
    await openStop(user, 'Sick and Destitute in Yangzhou')
    await user.click(screen.getByRole('button', { name: /All stops/ }))
    const row = screen.getByRole('button', {
      name: /Sick and Destitute in Yangzhou/,
    })
    expect(row.getAttribute('aria-current')).toBe('step')
  })
})
