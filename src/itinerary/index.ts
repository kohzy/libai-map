import { along } from '@turf/along'
import { lineString } from '@turf/helpers'
import { length } from '@turf/length'
import data from '@/data/libai-stop.json'
import type { Route, Segment, StepAction, StopCollection } from './types'

export type { Route, Segment, StepAction, Stop, StopProperties } from './types'

const ARC_STEPS = 500

export const stopCollection = data as StopCollection
export const stops = stopCollection.features

function buildArc(origin: number[], destination: number[]): Segment {
  const straight = lineString([origin, destination])
  const distance = length(straight, { units: 'miles' })
  const coordinates: number[][] = []
  for (let i = 0; i < distance; i += distance / ARC_STEPS) {
    coordinates.push(along(straight, i, { units: 'miles' }).geometry.coordinates)
  }
  return lineString(coordinates)
}

export const route: Route = {
  type: 'FeatureCollection',
  features: stops
    .slice(0, -1)
    .map((stop, n) => buildArc(stop.geometry.coordinates, stops[n + 1].geometry.coordinates)),
}

export function activeSegment(index: number): Segment {
  return route.features[Math.max(0, index - 1)]
}

export function step(index: number, action: StepAction): number {
  switch (action) {
    case 'start':
      return 0
    case 'prev':
      return Math.max(0, index - 1)
    case 'next':
      return index >= stops.length - 1 ? 0 : index + 1
  }
}
