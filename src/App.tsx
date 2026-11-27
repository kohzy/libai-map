import { useState } from 'react'
import MapView from '@/components/MapView/MapView'
import { activeSegment, step, stops } from '@/itinerary'
import type { StepAction } from '@/itinerary'
import styles from './App.module.css'

function App() {
  const [index, setIndex] = useState(0)
  const stop = stops[index]
  const onStep = (action: StepAction) => setIndex((current) => step(current, action))

  return (
    <div className={styles.layout}>
      <div>
        <button type="button" onClick={() => onStep('start')}>
          Back to Start
        </button>
        <button type="button" onClick={() => onStep('prev')}>
          Prev
        </button>
        <button type="button" onClick={() => onStep('next')}>
          Next
        </button>
        <p>{stop.properties.title}</p>
      </div>
      <MapView stop={stop} segment={activeSegment(index)} />
    </div>
  )
}

export default App
