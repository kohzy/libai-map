import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import StepControls from './StepControls'

describe('StepControls', () => {
  it('names the toolbar and its three buttons', () => {
    render(<StepControls onStep={() => {}} />)
    const toolbar = screen.getByRole('toolbar', { name: 'Journey navigation' })
    const names = [...toolbar.querySelectorAll('button')].map((b) => b.textContent)
    expect(names).toEqual(['Back to Start', 'Prev', 'Next'])
  })

  it('reports the matching step for each button click', async () => {
    const user = userEvent.setup()
    const onStep = vi.fn()
    render(<StepControls onStep={onStep} />)

    await user.click(screen.getByRole('button', { name: 'Next' }))
    await user.click(screen.getByRole('button', { name: 'Prev' }))
    await user.click(screen.getByRole('button', { name: 'Back to Start' }))

    expect(onStep.mock.calls).toEqual([['next'], ['prev'], ['start']])
  })

  it('takes one tab stop, moves with the arrow keys, and presses with Enter', async () => {
    const user = userEvent.setup()
    const onStep = vi.fn()
    render(<StepControls onStep={onStep} />)

    await user.tab()
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Back to Start' }))
    await user.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Prev' }))
    await user.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Next' }))
    await user.keyboard('{Enter}')
    expect(onStep).toHaveBeenCalledExactlyOnceWith('next')

    await user.tab()
    expect(document.activeElement).toBe(document.body)
  })
})
