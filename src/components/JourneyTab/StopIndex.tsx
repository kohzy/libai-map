import type { Dispatch } from 'react'
import PanelScroll from '@/components/PanelScroll/PanelScroll'
import { stops } from '@/itinerary'
import { decadeGroups, hasPoem } from '@/itinerary/poems'
import type { JourneyAction } from '@/journey/useJourney'
import styles from './JourneyTab.module.css'

const GROUPS = decadeGroups()

type StopIndexProps = {
  current: number | null
  dispatch: Dispatch<JourneyAction>
}

function StopIndex({ current, dispatch }: StopIndexProps) {
  return (
    <PanelScroll label="Journey stops">
      <nav aria-label="Journey stops" className={styles.index}>
        {GROUPS.map((group) => (
          <section key={group.label} className={styles.decade}>
            <h2 className={styles.decadeLabel}>{group.label}</h2>
            <ol className={styles.rows}>
              {group.indices.map((i) => {
                const stop = stops[i]
                const poem = hasPoem(stop)
                const isCurrent = current === i
                return (
                  <li key={stop.properties.title}>
                    <button
                      type="button"
                      className={styles.row}
                      data-current={isCurrent || undefined}
                      aria-current={isCurrent ? 'step' : undefined}
                      onClick={() => dispatch({ type: 'openStop', index: i })}
                    >
                      <span className={styles.rowYear}>
                        {stop.properties.year}
                      </span>
                      <span className={styles.rowText}>
                        <span className={styles.rowTitle}>
                          {stop.properties.title}
                        </span>
                        <span className={styles.rowMeta}>
                          {poem ? 'Read poem' : ''}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className={styles.marker}
                        data-kind={
                          isCurrent ? 'current' : poem ? 'poem' : 'none'
                        }
                      />
                    </button>
                  </li>
                )
              })}
            </ol>
          </section>
        ))}
      </nav>
    </PanelScroll>
  )
}

export default StopIndex
