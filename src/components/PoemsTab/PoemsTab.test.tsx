import { within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/test/renderApp'

describe('Poems tab', () => {
  it('lists 16 poems with titles in both languages and the date line', async () => {
    const { user, screen } = renderApp()
    await user.click(screen.getByRole('tab', { name: 'Poems' }))
    const rows = within(
      screen.getByRole('navigation', { name: 'Poems' })
    ).getAllByRole('button')
    expect(rows).toHaveLength(16)
    expect(rows[4].textContent).toContain('Reflection in a Quiet Night')
    expect(rows[4].textContent).toContain('静夜思')
    expect(rows[4].textContent).toContain('726 in Yangzhou, stop 14, age 25')
  })

  it('opens the reader on the chosen poem and marks its row', async () => {
    const { user, screen } = renderApp()
    await user.click(screen.getByRole('tab', { name: 'Poems' }))
    await user.click(
      screen.getByRole('button', { name: /Reflection in a Quiet Night/ })
    )
    const reader = screen.getByRole('region', { name: 'Poem reader' })
    expect(
      within(reader).getByRole('heading', {
        name: 'Reflection in a Quiet Night',
      })
    ).toBeTruthy()
    expect(
      screen
        .getByRole('button', { name: /Reflection in a Quiet Night/ })
        .getAttribute('aria-current')
    ).toBe('true')
  })
})

describe('About tab', () => {
  it('opens with The book expanded and keeps one section open', async () => {
    const { user, screen } = renderApp()
    await user.click(screen.getByRole('tab', { name: 'About' }))
    const book = screen.getByRole('button', { name: 'The book' })
    const colophon = screen.getByRole('button', { name: 'Colophon' })
    expect(book.getAttribute('aria-expanded')).toBe('true')
    expect(colophon.getAttribute('aria-expanded')).toBe('false')

    await user.click(colophon)
    expect(colophon.getAttribute('aria-expanded')).toBe('true')
    expect(book.getAttribute('aria-expanded')).toBe('false')
  })
})
