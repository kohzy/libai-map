import { useSyncExternalStore } from 'react'

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window.matchMedia !== 'function') return () => {}
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    () =>
      typeof window.matchMedia === 'function' &&
      window.matchMedia(query).matches,
    () => false
  )
}

export const PHONE_QUERY = '(max-width: 39.99em)'
