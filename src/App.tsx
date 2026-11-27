import { lazy, Suspense, useState } from 'react'
import MapErrorBoundary from '@/components/MapView/MapErrorBoundary'
import SidePanel from '@/components/SidePanel/SidePanel'
import { activeSegment, step, stops } from '@/itinerary'
import type { StepAction } from '@/itinerary'
import styles from './App.module.css'

const MapView = lazy(() => import('@/components/MapView/MapView'))

function App() {
  const [index, setIndex] = useState(0)
  const onStep = (action: StepAction) => setIndex((current) => step(current, action))

  return (
    <div className={styles.layout}>
      <SidePanel stop={stops[index]} onStep={onStep} />
      <MapErrorBoundary>
        <Suspense fallback={null}>
          <MapView stop={stops[index]} segment={activeSegment(index)} />
        </Suspense>
      </MapErrorBoundary>
    </div>
  )
}

export default App
