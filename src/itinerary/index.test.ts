import { describe, expect, it } from 'vitest'
import {
  activeSegment,
  cameraFor,
  route,
  routeBounds,
  step,
  stops,
} from './index'

const last = stops.length - 1

describe('step', () => {
  it('moves forward with next', () => {
    expect(step(0, 'next')).toBe(1)
    expect(step(37, 'next')).toBe(38)
  })

  it('wraps to the first stop after the last one', () => {
    expect(last).toBe(38)
    expect(step(last, 'next')).toBe(0)
  })

  it('moves back with prev and stays at the first stop', () => {
    expect(step(5, 'prev')).toBe(4)
    expect(step(0, 'prev')).toBe(0)
  })

  it('returns to the first stop with start', () => {
    expect(step(20, 'start')).toBe(0)
  })
})

describe('activeSegment', () => {
  it('is the segment arriving at the stop, or the first segment at the start', () => {
    expect(activeSegment(0)).toBe(route.features[0])
    expect(activeSegment(1)).toBe(route.features[0])
    expect(activeSegment(2)).toBe(route.features[1])
    expect(activeSegment(38)).toBe(route.features[37])
  })
})

describe('route', () => {
  it('has one arc between each pair of consecutive stops', () => {
    expect(route.features).toHaveLength(38)
  })

  it('starts each arc at its origin stop and ends near its destination', () => {
    route.features.forEach((segment, n) => {
      const coords = segment.geometry.coordinates
      const origin = stops[n].geometry.coordinates
      const destination = stops[n + 1].geometry.coordinates
      expect(coords[0]).toEqual(origin)
      const end = coords[coords.length - 1]
      expect(end[0]).toBeCloseTo(destination[0], 0)
      expect(end[1]).toBeCloseTo(destination[1], 0)
    })
  })
})

describe('cameraFor', () => {
  it("uses the stop's own camera values when present", () => {
    expect(cameraFor(stops[0])).toEqual({
      center: stops[0].geometry.coordinates,
      zoom: 5,
      bearing: 27,
      pitch: 20,
    })
  })

  it('falls back to zoom 10, bearing 30 and pitch 0 like the original map', () => {
    const stop = { ...stops[1], properties: { ...stops[1].properties } }
    delete stop.properties.mapbox_bearing
    delete stop.properties.mapbox_pitch
    expect(cameraFor(stop)).toEqual({
      center: stop.geometry.coordinates,
      zoom: 10,
      bearing: 30,
      pitch: 0,
    })
  })
})

describe('routeBounds', () => {
  it('spans from Suyab in the west to Hangzhou in the east', () => {
    const [[west, south], [east, north]] = routeBounds()
    expect(west).toBe(stops[0].geometry.coordinates[0])
    expect(east).toBe(stops[20].geometry.coordinates[0])
    for (const stop of stops) {
      const [lon, lat] = stop.geometry.coordinates
      expect(lon).toBeGreaterThanOrEqual(west)
      expect(lon).toBeLessThanOrEqual(east)
      expect(lat).toBeGreaterThanOrEqual(south)
      expect(lat).toBeLessThanOrEqual(north)
    }
  })
})

describe('stops', () => {
  it('keeps optional camera values optional', () => {
    expect(stops[0].properties.mapbox_zoom).toBe(5)
    expect(stops[1].properties.mapbox_zoom).toBeUndefined()
  })
})
