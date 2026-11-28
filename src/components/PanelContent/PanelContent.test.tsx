import { within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { openStop, renderApp } from '@/test/renderApp'

describe('panel tabs and header', () => {
  it('names the tab list and starts on Journey', () => {
    const { screen } = renderApp()
    const list = screen.getByRole('tablist', { name: 'Panel' })
    const tabs = within(list).getAllByRole('tab')
    expect(tabs.map((tab) => tab.textContent)).toEqual([
      'Journey',
      'Poems',
      'About',
    ])
    expect(tabs[0].getAttribute('aria-selected')).toBe('true')
  })

  it('switches panels by click and by arrow key', async () => {
    const { user, screen } = renderApp()
    await user.click(screen.getByRole('tab', { name: 'Poems' }))
    expect(
      screen.getByRole('tab', { name: 'Poems' }).getAttribute('aria-selected')
    ).toBe('true')
    expect(screen.getByText(/16 poems, in journey order/)).toBeTruthy()

    await user.click(screen.getByRole('tab', { name: 'Journey' }))
    await user.keyboard('{ArrowRight}')
    expect(
      screen.getByRole('tab', { name: 'Poems' }).getAttribute('aria-selected')
    ).toBe('true')
  })

  it('returns to the start of the journey from the title', async () => {
    const { user, screen } = renderApp()
    await openStop(user, 'Sick and Destitute in Yangzhou')
    expect(screen.getByText('Stop 14 of 39')).toBeTruthy()
    await user.click(screen.getByRole('tab', { name: 'About' }))

    await user.click(
      screen.getByRole('button', { name: 'Following the Banished Immortal' })
    )
    expect(
      screen.getByRole('tab', { name: 'Journey' }).getAttribute('aria-selected')
    ).toBe('true')
    expect(
      screen.getByRole('navigation', { name: 'Journey stops' })
    ).toBeTruthy()
    expect(screen.queryByText('Stop 14 of 39')).toBeNull()
  })
})
