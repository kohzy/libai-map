import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import App from '@/App'

// mapbox-gl needs WebGL, which jsdom lacks; the map is covered by the browser checks.
vi.mock('@/components/MapView/MapView', () => ({
  default: () => <div data-testid="map" />,
}))

export function renderApp() {
  const user = userEvent.setup()
  render(<App />)
  return { user, screen }
}

export async function openStop(
  user: ReturnType<typeof userEvent.setup>,
  title: string
) {
  await user.click(screen.getByRole('button', { name: new RegExp(title) }))
}
