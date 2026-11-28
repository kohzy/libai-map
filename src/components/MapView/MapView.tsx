import mapboxgl from 'mapbox-gl'
import type { AnyLayer, GeoJSONSource } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useEffect, useRef } from 'react'
import { matchesQuery } from '@/hooks/useMediaQuery'
import {
  cameraFor,
  route,
  routeBounds,
  routeUpTo,
  stopCollection,
} from '@/itinerary'
import type { Segment, Stop } from '@/itinerary'
import styles from './MapView.module.css'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_API_TOKEN as string | undefined
const MAP_STYLE = 'mapbox://styles/kohzy/ckbwr93pu1e4a1hmw0mltc38t'
const EASE_DURATION_MS = 5000
const ROUTE_PADDING = 64
const INTRO_DURATION_MS = 2500
const JOURNEY_COUNTRIES = ['CN', 'KG']
const NO_SEGMENT: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [],
}

const layers: AnyLayer[] = [
  {
    id: 'elsewhere',
    type: 'fill',
    source: 'countries',
    'source-layer': 'country_boundaries',
    filter: [
      'all',
      // Disputed areas come once per worldview, listed like "IN,JP,US"; keep a single one.
      [
        'any',
        ['==', ['get', 'worldview'], 'all'],
        ['in', 'US', ['get', 'worldview']],
      ],
      ['!=', ['get', 'disputed'], 'true'],
      ['!', ['match', ['get', 'iso_3166_1'], JOURNEY_COUNTRIES, true, false]],
    ],
    paint: {
      'fill-color': 'hsl(197, 48%, 6%)',
      'fill-opacity': 0.78,
    },
  },
  {
    id: 'route',
    type: 'line',
    source: 'route',
    paint: {
      'line-width': 3,
      'line-color': 'rgba(201, 198, 192, 0.45)',
    },
  },
  {
    id: 'activeRoute',
    type: 'line',
    source: 'activeRoute',
    paint: {
      'line-width': 8,
      'line-color': '#F38200',
    },
  },
  {
    id: 'points',
    type: 'symbol',
    source: 'libaistops',
    layout: {
      'icon-image': 'embassy-15',
      'icon-size': 1.5,
    },
  },
]

type MapViewProps = {
  stop: Stop
  segment: Segment
  started: boolean
}

function showView(map: mapboxgl.Map, view: MapViewProps) {
  const source = map.getSource('activeRoute') as GeoJSONSource
  if (view.started) {
    source.setData(view.segment)
    map.easeTo({ ...cameraFor(view.stop), duration: EASE_DURATION_MS })
  } else {
    source.setData(NO_SEGMENT)
    map.fitBounds(routeBounds(), {
      padding: ROUTE_PADDING,
      bearing: 0,
      pitch: 0,
      duration: EASE_DURATION_MS / 2,
    })
  }
}

function drawRoute(source: GeoJSONSource): () => void {
  let frame = 0
  const start = performance.now()
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / INTRO_DURATION_MS)
    source.setData(routeUpTo(1 - (1 - t) ** 3))
    if (t < 1) frame = requestAnimationFrame(tick)
  }
  frame = requestAnimationFrame(tick)
  return () => cancelAnimationFrame(frame)
}

function MapView({ stop, segment, started }: MapViewProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const latestRef = useRef<MapViewProps>({ stop, segment, started })

  useEffect(() => {
    if (!MAPBOX_TOKEN || !containerRef.current || !wrapperRef.current) return

    mapboxgl.accessToken = MAPBOX_TOKEN
    const initial = latestRef.current
    const camera = cameraFor(initial.stop)
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      ...(initial.started
        ? { center: camera.center, zoom: camera.zoom }
        : {
            bounds: routeBounds(),
            fitBoundsOptions: { padding: ROUTE_PADDING },
          }),
    })
    map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    let stopDrawing = () => {}

    map.on('load', () => {
      map.addSource('countries', {
        type: 'vector',
        url: 'mapbox://mapbox.country-boundaries-v1',
      })
      map.addSource('libaistops', { type: 'geojson', data: stopCollection })
      const animate = !matchesQuery('(prefers-reduced-motion: reduce)')
      map.addSource('route', {
        type: 'geojson',
        data: animate ? NO_SEGMENT : route,
      })
      map.addSource('activeRoute', {
        type: 'geojson',
        data: initial.started ? initial.segment : NO_SEGMENT,
      })
      layers.forEach((layer) => map.addLayer(layer))
      mapRef.current = map
      if (animate)
        stopDrawing = drawRoute(map.getSource('route') as GeoJSONSource)

      // A step, or a return home, taken while the style was loading has to be applied now.
      const latest = latestRef.current
      if (latest.stop !== initial.stop || latest.started !== initial.started)
        showView(map, latest)
    })

    // mapbox-gl 1.x only follows window resizes; the panel and the reader also change this pane's size.
    const observer = new ResizeObserver(() => map.resize())
    observer.observe(wrapperRef.current)

    return () => {
      observer.disconnect()
      stopDrawing()
      mapRef.current = null
      map.remove()
    }
  }, [])

  useEffect(() => {
    latestRef.current = { stop, segment, started }
    const map = mapRef.current
    if (!map) return
    showView(map, { stop, segment, started })
  }, [stop, segment, started])

  if (!MAPBOX_TOKEN) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.message}>
          The map needs a Mapbox token. Set <code>VITE_MAPBOX_API_TOKEN</code>{' '}
          in <code>.env.local</code> and restart the dev server.
        </p>
      </div>
    )
  }

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <div ref={containerRef} className={styles.map} />
    </div>
  )
}

export default MapView
