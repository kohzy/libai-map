import type { Feature, FeatureCollection, LineString, Point } from 'geojson'

export type StopProperties = {
  title: string
  'historic-name': string
  'modern-name': string
  year: number
  'book-page': number
  companion?: string[]
  thumbnail?: string
  mapbox_bearing?: number
  mapbox_pitch?: number
  mapbox_zoom?: number
  'poem-notable-zh-cn'?: string[]
  'poem-notable-title-zh-cn'?: string
  'poem-trans-hajin-en'?: string[]
  'poem-trans-title-hajin-en'?: string
}

export type Stop = Feature<Point, StopProperties>
export type StopCollection = FeatureCollection<Point, StopProperties>
export type Segment = Feature<LineString>
export type Route = FeatureCollection<LineString>
export type StepAction = 'start' | 'prev' | 'next'
