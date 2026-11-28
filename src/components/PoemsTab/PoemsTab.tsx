import type { Dispatch } from 'react'
import PanelScroll from '@/components/PanelScroll/PanelScroll'
import { stops } from '@/itinerary'
import { poemInfo, poemStops } from '@/itinerary/poems'
import type { JourneyAction, JourneyState } from '@/journey/useJourney'
import styles from './PoemsTab.module.css'

const POEM_STOPS = poemStops()

type PoemsTabProps = {
  state: JourneyState
  dispatch: Dispatch<JourneyAction>
}

function PoemsTab({ state, dispatch }: PoemsTabProps) {
  return (
    <PanelScroll label="Poems">
      <nav aria-label="Poems" className={styles.list}>
        <p className={styles.intro}>
          {POEM_STOPS.length} poems, in journey order. Each opens in the reader.
        </p>
        <ol className={styles.rows}>
          {POEM_STOPS.map((i) => {
            const p = stops[i].properties
            const open = state.poemOpen && state.index === i
            return (
              <li key={p['poem-notable-title-zh-cn']}>
                <button
                  type="button"
                  className={styles.row}
                  data-open={open || undefined}
                  aria-current={open ? 'true' : undefined}
                  onClick={() => dispatch({ type: 'openPoem', index: i })}
                >
                  <span className={styles.title}>
                    {p['poem-trans-title-hajin-en']}
                  </span>
                  <span lang="zh-Hans" className={styles.zh}>
                    {p['poem-notable-title-zh-cn']}
                  </span>
                  <span className={styles.info}>{poemInfo(stops[i])}</span>
                </button>
              </li>
            )
          })}
        </ol>
      </nav>
    </PanelScroll>
  )
}

export default PoemsTab
