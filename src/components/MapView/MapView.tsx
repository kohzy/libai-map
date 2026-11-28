import mapboxgl from 'mapbox-gl'
import type { AnyLayer, GeoJSONSource } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useEffect, useRef } from 'react'
import { cameraFor, route, routeBounds, stopCollection } from '@/itinerary'
import type { Segment, Stop } from '@/itinerary'
import styles from './MapView.module.css'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_API_TOKEN as string | undefined
const MAP_STYLE = 'mapbox://styles/kohzy/ckbwr93pu1e4a1hmw0mltc38t'
const EASE_DURATION_MS = 5000
const ROUTE_PADDING = 64
const NO_SEGMENT: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [],
}

const layers: AnyLayer[] = [
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
      'text-field': ['get', 'title'],
      'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
      'text-offset': [0, 1],
      'text-anchor': 'top',
      'text-size': 22,
    },
    paint: {
      'text-color': 'rgba(233, 229, 222, 0.9)',
      'text-halo-color': 'rgba(22, 23, 25, 0.9)',
      'text-halo-width': 1.2,
    },
  },
]

type MapViewProps = {
  stop: Stop
  segment: Segment
  started: boolean
}

type View = MapViewProps

function showView(map: mapboxgl.Map, view: View) {
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

function MapView({ stop, segment, started }: MapViewProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const latestRef = useRef<View>({ stop, segment, started })

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

    map.on('load', () => {
      map.addSource('libaistops', { type: 'geojson', data: stopCollection })
      map.addSource('route', { type: 'geojson', data: route })
      map.addSource('activeRoute', {
        type: 'geojson',
        data: initial.started ? initial.segment : NO_SEGMENT,
      })
      layers.forEach((layer) => map.addLayer(layer))
      mapRef.current = map

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
