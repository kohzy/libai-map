import React from 'react'

import Layout from 'components/Layout'
import Map from 'components/Map'

import { FaGlobeAmericas as SiteLogo } from 'react-icons/fa'

const sources = {
  oregon: {
    type: 'geojson',
    data: {
      type: 'Polygon',
      coordinates: [
        [
          [-124.03564453125, 46.195042108660154],
          [-124.5849609375, 42.89206418807337],
          [-124.365234375, 42.049292638686836],
          [-117.00439453125, 42.049292638686836],
          [-116.96044921875, 45.99696161820381],
          [-118.98193359375, 46.027481852486645],
          [-121.201171875, 45.66012730272194],
          [-122.32177734375, 45.61403741135093],
          [-122.76123046875, 45.644768217751924],
          [-122.98095703125, 46.195042108660154],
          [-123.6181640625, 46.240651955001695],
          [-124.03564453125, 46.195042108660154],
        ],
      ],
    },
  },
  markers: {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-77.032, 38.913]
        },
        properties: {
          title: 'Mapbox',
          description: 'Washington, D.C.',
          icon: 'harbor'
        }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-122.414, 37.776]
        },
        properties: {
          title: 'Mapbox',
          description: 'San Francisco, California'
        }
      }]
    },
  },
}

const layers = [
   {
    id: '2',
    source: 'markers',
    type: 'symbol',
    layout: {
      'text-field': ['get', 'title'],
      'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
      'text-offset': [0, 0.6],
      'text-anchor': 'top',
    },
  }
]

const MapPage = () => {
  return (
    <Layout title="Full Screen Map">
      <Map sources={sources} layers={layers} />
    </Layout>
  )
}

export default MapPage
