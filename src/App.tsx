import { useState } from 'react'
import MapView from '@/components/MapView/MapView'
import SidePanel from '@/components/SidePanel/SidePanel'
import { activeSegment, step, stops } from '@/itinerary'
import type { StepAction } from '@/itinerary'
import styles from './App.module.css'

function App() {
  const [index, setIndex] = useState(0)
  const onStep = (action: StepAction) => setIndex((current) => step(current, action))

  return (
    <div className={styles.layout}>
      <SidePanel stop={stops[index]} onStep={onStep} />
      <MapView stop={stops[index]} segment={activeSegment(index)} />
    </div>
  )
}

export default App
