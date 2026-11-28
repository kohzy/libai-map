import { describe, expect, it } from 'vitest'
import { initialState, journeyReducer } from './reducer'
import type { JourneyState } from './reducer'

const run = (state: JourneyState, ...actions: Parameters<typeof journeyReducer>[1][]) =>
  actions.reduce(journeyReducer, state)

describe('journeyReducer', () => {
  it('starts on the Journey tab, stop index, nothing started, reader closed', () => {
    expect(initialState).toEqual({ tab: 'journey', view: 'index', index: 0, started: false, poemOpen: false })
  })

  it('opens a stop in the stop view', () => {
    expect(run(initialState, { type: 'openStop', index: 13 })).toMatchObject({ view: 'stop', index: 13, started: true })
  })

  it('wraps next from the last stop and holds prev at the first', () => {
    expect(run(initialState, { type: 'openStop', index: 38 }, { type: 'step', action: 'next' }).index).toBe(0)
    expect(run(initialState, { type: 'openStop', index: 0 }, { type: 'step', action: 'prev' }).index).toBe(0)
  })

  it('opens a poem from the Poems tab without changing the tab or view', () => {
    const state = run(initialState, { type: 'selectTab', tab: 'poems' }, { type: 'openPoem', index: 13 })
    expect(state).toEqual({ tab: 'poems', view: 'index', index: 13, started: true, poemOpen: true })
  })

  it('cycles through poem stops with stepPoem', () => {
    expect(run(initialState, { type: 'openPoem', index: 38 }, { type: 'stepPoem', action: 'next' }).index).toBe(3)
    expect(run(initialState, { type: 'openPoem', index: 3 }, { type: 'stepPoem', action: 'prev' }).index).toBe(38)
    expect(run(initialState, { type: 'openPoem', index: 13 }, { type: 'stepPoem', action: 'next' }).index).toBe(14)
  })

  it('closes the reader and keeps the stop and tab', () => {
    const state = run(initialState, { type: 'selectTab', tab: 'poems' }, { type: 'openPoem', index: 13 }, { type: 'closePoem' })
    expect(state).toMatchObject({ tab: 'poems', index: 13, poemOpen: false })
  })

  it('closes the reader when a stop is opened or stepped', () => {
    expect(run(initialState, { type: 'openPoem', index: 13 }, { type: 'openStop', index: 2 }).poemOpen).toBe(false)
    expect(run(initialState, { type: 'openPoem', index: 13 }, { type: 'step', action: 'next' }).poemOpen).toBe(false)
  })

  it('returns to the stop index with showIndex and keeps the position', () => {
    expect(run(initialState, { type: 'openStop', index: 5 }, { type: 'showIndex' })).toMatchObject({ view: 'index', index: 5, started: true })
  })

  it('goes home from anywhere', () => {
    const state = run(initialState, { type: 'selectTab', tab: 'poems' }, { type: 'openPoem', index: 20 }, { type: 'goHome' })
    expect(state).toEqual(initialState)
  })
})
