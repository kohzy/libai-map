import { Drawer, DrawerContent, DrawerHandle } from '@ui-sdk/react/drawer'
import {
  createResizableController,
  Resizable,
  ResizableHandle,
  ResizablePanel,
} from '@ui-sdk/react/resizable'
import { useState } from 'react'
import type { Dispatch } from 'react'
import PanelContent from '@/components/PanelContent/PanelContent'
import { PHONE_QUERY, useMediaQuery } from '@/hooks/useMediaQuery'
import type { JourneyAction, JourneyState } from '@/journey/useJourney'
import styles from './AppShell.module.css'
import MainArea from './MainArea'

type AppShellProps = {
  state: JourneyState
  dispatch: Dispatch<JourneyAction>
}

const PANEL_ID = 'journey-panel'
const PANEL_DEFAULT = '380px'
const SNAP_POINTS = [0.35, 0.65, 0.92]

function DesktopShell({ state, dispatch }: AppShellProps) {
  const [controller] = useState(createResizableController)
  return (
    <Resizable controller={controller} className={styles.desktop}>
      <ResizablePanel
        id={PANEL_ID}
        defaultSize={PANEL_DEFAULT}
        minSize="320px"
        maxSize="600px"
        className={styles.panelPane}
      >
        <PanelContent state={state} dispatch={dispatch} />
      </ResizablePanel>
      <ResizableHandle
        aria-label="Resize the stop panel"
        title="Drag to resize. Double-click to reset."
        className={styles.handle}
        onDoubleClick={() => controller.resize(PANEL_ID, PANEL_DEFAULT)}
      >
        <span className={styles.knob} aria-hidden="true" />
      </ResizableHandle>
      <ResizablePanel className={styles.mainPane}>
        <MainArea state={state} dispatch={dispatch} />
      </ResizablePanel>
    </Resizable>
  )
}

function PhoneShell({ state, dispatch }: AppShellProps) {
  const [snapPoint, setSnapPoint] = useState(SNAP_POINTS[1])
  return (
    <div className={styles.phone}>
      <MainArea state={state} dispatch={dispatch} />
      {/* The sheet sits in the top layer, so it closes while the full-screen reader is open. */}
      <Drawer
        open={!state.poemOpen}
        dismissible={false}
        snapPoints={SNAP_POINTS}
        snapPoint={snapPoint}
        onSnapPointChange={(next) => {
          if (typeof next === 'number') setSnapPoint(next)
        }}
        modalAbove={SNAP_POINTS[0]}
      >
        <DrawerContent
          keepMounted
          aria-label="Journey panel"
          className={styles.sheet}
        >
          <DrawerHandle
            aria-label="Resize the panel"
            className={styles.sheetHandle}
          />
          <PanelContent state={state} dispatch={dispatch} compact />
        </DrawerContent>
      </Drawer>
    </div>
  )
}

function AppShell(props: AppShellProps) {
  const phone = useMediaQuery(PHONE_QUERY)
  return phone ? <PhoneShell {...props} /> : <DesktopShell {...props} />
}

export default AppShell
