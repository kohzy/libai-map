import { useReducer } from 'react'
import { initialState, journeyReducer } from './reducer'

export function useJourney() {
  return useReducer(journeyReducer, initialState)
}

export type { JourneyAction, JourneyState, Tab } from './reducer'
