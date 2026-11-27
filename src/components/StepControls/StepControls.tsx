import { Toolbar, ToolbarButton } from '@ui-sdk/react/toolbar'
import type { StepAction } from '@/itinerary'
import styles from './StepControls.module.css'

type StepControlsProps = {
  onStep: (action: StepAction) => void
}

function StepControls({ onStep }: StepControlsProps) {
  return (
    <Toolbar aria-label="Journey navigation" className={styles.toolbar}>
      <ToolbarButton onClick={() => onStep('start')}>Back to Start</ToolbarButton>
      <ToolbarButton onClick={() => onStep('prev')}>Prev</ToolbarButton>
      <ToolbarButton onClick={() => onStep('next')}>Next</ToolbarButton>
    </Toolbar>
  )
}

export default StepControls
