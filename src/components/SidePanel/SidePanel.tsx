import PanelHeader from '@/components/PanelHeader/PanelHeader'
import StepControls from '@/components/StepControls/StepControls'
import StopDetails from '@/components/StopDetails/StopDetails'
import type { StepAction, Stop } from '@/itinerary'
import { site } from '@/site'
import styles from './SidePanel.module.css'

type SidePanelProps = {
  stop: Stop
  onStep: (action: StepAction) => void
}

function SidePanel({ stop, onStep }: SidePanelProps) {
  return (
    <aside className={styles.panel}>
      <PanelHeader
        title={site.title}
        subheader={site.subheader}
        bookPage={stop.properties['book-page']}
      />
      <StepControls onStep={onStep} />
      <StopDetails stop={stop} />
    </aside>
  )
}

export default SidePanel
