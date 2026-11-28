import type { Dispatch } from 'react'
import type { JourneyAction, JourneyState } from '@/journey/useJourney'
import StopIndex from './StopIndex'
import StopView from './StopView'

type JourneyTabProps = {
  state: JourneyState
  dispatch: Dispatch<JourneyAction>
}

function JourneyTab({ state, dispatch }: JourneyTabProps) {
  return state.view === 'stop' ? (
    <StopView index={state.index} dispatch={dispatch} />
  ) : (
    <StopIndex
      current={state.started ? state.index : null}
      dispatch={dispatch}
    />
  )
}

export default JourneyTab
