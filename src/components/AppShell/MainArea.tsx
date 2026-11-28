import { lazy, Suspense } from 'react'
import type { Dispatch } from 'react'
import MapErrorBoundary from '@/components/MapView/MapErrorBoundary'
import PoemReader from '@/components/PoemReader/PoemReader'
import { activeSegment, stops } from '@/itinerary'
import type { JourneyAction, JourneyState } from '@/journey/useJourney'
import styles from './AppShell.module.css'

const MapView = lazy(() => import('@/components/MapView/MapView'))

type MainAreaProps = {
  state: JourneyState
  dispatch: Dispatch<JourneyAction>
}

function MainArea({ state, dispatch }: MainAreaProps) {
  const stop = stops[state.index]
  return (
    <main className={styles.main}>
      <div
        className={styles.mapLayer}
        data-hidden={state.poemOpen || undefined}
        aria-hidden={state.poemOpen || undefined}
      >
        <MapErrorBoundary>
          <Suspense fallback={null}>
            <MapView
              stop={stop}
              segment={activeSegment(state.index)}
              started={state.started}
            />
          </Suspense>
        </MapErrorBoundary>
      </div>
      {state.poemOpen && (
        <PoemReader
          stop={stop}
          onPrev={() => dispatch({ type: 'stepPoem', action: 'prev' })}
          onNext={() => dispatch({ type: 'stepPoem', action: 'next' })}
          onClose={() => dispatch({ type: 'closePoem' })}
        />
      )}
    </main>
  )
}

export default MainArea
