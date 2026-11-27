import mapboxgl from 'mapbox-gl'
import type { AnyLayer, GeoJSONSource } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useEffect, useRef } from 'react'
import { cameraFor, route, stopCollection } from '@/itinerary'
import type { Segment, Stop } from '@/itinerary'
import styles from './MapView.module.css'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_API_TOKEN as string | undefined
const MAP_STYLE = 'mapbox://styles/kohzy/ckbwr93pu1e4a1hmw0mltc38t'
const EASE_DURATION_MS = 5000

const layers: AnyLayer[] = [
  {
    id: 'route',
    type: 'line',
    source: 'route',
    paint: {
      'line-width': 4,
      'line-color': 'rgba(162, 110, 79, 0.5)',
    },
  },
  {
    id: 'activeRoute',
    type: 'line',
    source: 'activeRoute',
    paint: {
      'line-width': 10,
      'line-color': '#FF7600',
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
      'text-size': 25,
    },
    paint: {
      'text-color': 'rgba(230, 94, 13,0.9)',
      'text-halo-color': 'rgba(0, 0, 0,0.8)',
      'text-halo-width': 1,
    },
  },
]

type MapViewProps = {
  stop: Stop
  segment: Segment
}

function showStop(map: mapboxgl.Map, stop: Stop, segment: Segment) {
  ;(map.getSource('activeRoute') as GeoJSONSource).setData(segment)
  map.easeTo({ ...cameraFor(stop), duration: EASE_DURATION_MS })
}

function MapView({ stop, segment }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const latestRef = useRef({ stop, segment })

  useEffect(() => {
    if (!MAPBOX_TOKEN || !containerRef.current) return

    mapboxgl.accessToken = MAPBOX_TOKEN
    const initial = latestRef.current.stop
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: cameraFor(initial).center,
      zoom: cameraFor(initial).zoom,
    })
    map.addControl(new mapboxgl.NavigationControl(), 'top-right')

    map.on('load', () => {
      map.addSource('libaistops', { type: 'geojson', data: stopCollection })
      map.addSource('route', { type: 'geojson', data: route })
      map.addSource('activeRoute', { type: 'geojson', data: latestRef.current.segment })
      layers.forEach((layer) => map.addLayer(layer))
      mapRef.current = map

      // A step taken while the style was loading has to be applied now.
      if (latestRef.current.stop !== initial) {
        showStop(map, latestRef.current.stop, latestRef.current.segment)
      }
    })

    return () => {
      mapRef.current = null
      map.remove()
    }
  }, [])

  useEffect(() => {
    latestRef.current = { stop, segment }
    const map = mapRef.current
    if (!map) return
    showStop(map, stop, segment)
  }, [stop, segment])

  if (!MAPBOX_TOKEN) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.missingToken}>
          The map needs a Mapbox token. Set <code>VITE_MAPBOX_API_TOKEN</code> in{' '}
          <code>.env.local</code> and restart the dev server.
        </p>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div ref={containerRef} className={styles.map} />
    </div>
  )
}

export default MapView
