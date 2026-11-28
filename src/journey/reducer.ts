import { step } from '@/itinerary'
import type { StepAction } from '@/itinerary'
import { poemStops } from '@/itinerary/poems'

export type Tab = 'journey' | 'poems' | 'about'

export type JourneyState = {
  tab: Tab
  view: 'index' | 'stop'
  index: number
  started: boolean
  poemOpen: boolean
}

export type JourneyAction =
  | { type: 'selectTab'; tab: Tab }
  | { type: 'openStop'; index: number }
  | { type: 'step'; action: StepAction }
  | { type: 'showIndex' }
  | { type: 'openPoem'; index: number }
  | { type: 'stepPoem'; action: 'prev' | 'next' }
  | { type: 'closePoem' }
  | { type: 'goHome' }

export const initialState: JourneyState = {
  tab: 'journey',
  view: 'index',
  index: 0,
  started: false,
  poemOpen: false,
}

const POEM_STOPS = poemStops()

export function journeyReducer(
  state: JourneyState,
  action: JourneyAction
): JourneyState {
  switch (action.type) {
    case 'selectTab':
      return { ...state, tab: action.tab }
    case 'openStop':
      return {
        ...state,
        view: 'stop',
        index: action.index,
        started: true,
        poemOpen: false,
      }
    case 'step':
      return {
        ...state,
        view: 'stop',
        index: step(state.index, action.action),
        started: true,
        poemOpen: false,
      }
    case 'showIndex':
      return { ...state, view: 'index' }
    case 'openPoem':
      return { ...state, index: action.index, started: true, poemOpen: true }
    case 'stepPoem': {
      const pos = POEM_STOPS.indexOf(state.index)
      const delta = action.action === 'next' ? 1 : -1
      const next =
        POEM_STOPS[(pos + delta + POEM_STOPS.length) % POEM_STOPS.length]
      return { ...state, index: next, poemOpen: true }
    }
    case 'closePoem':
      return { ...state, poemOpen: false }
    case 'goHome':
      return initialState
  }
}
