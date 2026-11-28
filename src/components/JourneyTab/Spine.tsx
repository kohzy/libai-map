import { useEffect, useRef } from 'react'
import type { KeyboardEvent } from 'react'
import { stops } from '@/itinerary'
import { hasPoem } from '@/itinerary/poems'
import styles from './JourneyTab.module.css'

type SpineProps = {
  index: number
  onSelect: (index: number) => void
}

const LAST = stops.length - 1

// One tab stop for all 39 ticks: arrow keys, Home and End move and open, like a toolbar.
function Spine({ index, onSelect }: SpineProps) {
  const groupRef = useRef<HTMLDivElement>(null)
  const movedByKey = useRef(false)

  useEffect(() => {
    if (!movedByKey.current) return
    movedByKey.current = false
    groupRef.current
      ?.querySelector<HTMLButtonElement>('[data-current]')
      ?.focus()
  }, [index])

  const onKeyDown = (event: KeyboardEvent) => {
    const target = {
      ArrowRight: Math.min(LAST, index + 1),
      ArrowLeft: Math.max(0, index - 1),
      Home: 0,
      End: LAST,
    }[event.key]
    if (target === undefined) return
    event.preventDefault()
    if (target === index) return
    movedByKey.current = true
    onSelect(target)
  }

  return (
    <div
      ref={groupRef}
      role="group"
      aria-label="Jump to a stop"
      className={styles.spine}
      onKeyDown={onKeyDown}
    >
      {stops.map((stop, i) => {
        const state = i === index ? 'current' : i < index ? 'visited' : 'ahead'
        return (
          <button
            key={stop.properties.title}
            type="button"
            className={styles.tick}
            tabIndex={i === index ? 0 : -1}
            aria-label={`Stop ${i + 1}: ${stop.properties.title}`}
            aria-current={i === index ? 'step' : undefined}
            data-current={i === index || undefined}
            onClick={() => onSelect(i)}
          >
            <span
              className={styles.tickBar}
              data-state={state}
              data-poem={hasPoem(stop) || undefined}
            />
          </button>
        )
      })}
    </div>
  )
}

export default Spine
