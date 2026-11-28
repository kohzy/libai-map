import { along } from '@turf/along'
import { lineString } from '@turf/helpers'
import { length } from '@turf/length'
import data from '@/data/libai-stop.json'
import type { Route, Segment, StepAction, Stop, StopCollection } from './types'

export type { Route, Segment, StepAction, Stop } from './types'

const ARC_STEPS = 500

export const stopCollection = data as StopCollection
export const stops = stopCollection.features

function buildArc(origin: number[], destination: number[]): Segment {
  const straight = lineString([origin, destination])
  const distance = length(straight, { units: 'miles' })
  const stepMiles = distance / ARC_STEPS
  const coordinates: number[][] = []
  for (let i = 0; i < distance; i += stepMiles) {
    coordinates.push(
      along(straight, i, { units: 'miles' }).geometry.coordinates
    )
  }
  return lineString(coordinates)
}

export const route: Route = {
  type: 'FeatureCollection',
  features: stops
    .slice(0, -1)
    .map((stop, n) =>
      buildArc(stop.geometry.coordinates, stops[n + 1].geometry.coordinates)
    ),
}

const segmentMiles = route.features.map((segment) =>
  length(segment, { units: 'miles' })
)
const routeMiles = segmentMiles.reduce((sum, miles) => sum + miles, 0)

export function routeUpTo(fraction: number): Route {
  if (fraction >= 1) return route
  let remaining = Math.max(0, fraction) * routeMiles
  const features: Segment[] = []
  for (const [n, segment] of route.features.entries()) {
    if (remaining <= 0) break
    if (remaining >= segmentMiles[n]) {
      features.push(segment)
    } else {
      // Arc points are evenly spaced, so a share of the points is the same share of the distance.
      const points = segment.geometry.coordinates
      const count = Math.max(
        2,
        Math.ceil((points.length * remaining) / segmentMiles[n])
      )
      features.push(lineString(points.slice(0, count)))
    }
    remaining -= segmentMiles[n]
  }
  return { type: 'FeatureCollection', features }
}

export function routeBounds(): [[number, number], [number, number]] {
  const lons = stops.map((stop) => stop.geometry.coordinates[0])
  const lats = stops.map((stop) => stop.geometry.coordinates[1])
  return [
    [Math.min(...lons), Math.min(...lats)],
    [Math.max(...lons), Math.max(...lats)],
  ]
}

export function activeSegment(index: number): Segment {
  return route.features[Math.max(0, index - 1)]
}

export type Camera = {
  center: [number, number]
  zoom: number
  bearing: number
  pitch: number
}

// Stops without their own camera values have always used these.
const DEFAULT_CAMERA = { zoom: 10, bearing: 30, pitch: 0 }

export function cameraFor(stop: Stop): Camera {
  const { mapbox_zoom, mapbox_bearing, mapbox_pitch } = stop.properties
  return {
    center: stop.geometry.coordinates as [number, number],
    zoom: mapbox_zoom ?? DEFAULT_CAMERA.zoom,
    bearing: mapbox_bearing ?? DEFAULT_CAMERA.bearing,
    pitch: mapbox_pitch ?? DEFAULT_CAMERA.pitch,
  }
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
