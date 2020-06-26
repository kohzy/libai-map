import React, { useState } from 'react'
import * as turf from '@turf/turf'

import Layout from 'components/Layout'
import Timeline from 'components/Timeline/timeline'
import Map2 from 'components/Map2'

import GeoJSONData from 'data/libai-stop.json'

const sources = {
  libaistops: {
    type: "geojson",
    data: GeoJSONData
  },
  route: {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
      ]
    }
  },
  activeRoute: {
    type: "geojson",
    data: {
    }
  }
}

const layers = [
  {
  id: "route",
  type: "line",
  source: "route",
  paint: {
    'line-width': 4,
    'line-color': "rgba(162, 110, 79, 0.5)"
  }
},
{
  id: "activeRoute",
  type: "line",
  source: "activeRoute",
  paint: {
    'line-width': 8,
    'line-color': "#FF7600"
  }
},
{
  id: 'points',
  type: 'symbol',
  source: 'libaistops',
  layout: {
    'icon-image': 'monument-15',
    'icon-size': 1.5,
    // get the title name from the source's "historic-name" property
    'text-field': ['get', 'title'],
    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
    'text-offset': [0, 1],
    'text-anchor': 'top',
    'text-size': 20
    },
  paint: {
    'icon-color': "#CBD5F5",
    'text-halo-color': "#FFFFFF",
    'text-halo-width': 1.5
  }
  } 
]

// populate GEJSON "routes" data source with start/end pairs of segments
for (let n = 0; n < sources.libaistops.data.features.length-1; n += 1) {
  let origin = sources.libaistops.data.features[n].geometry.coordinates
  let destination = sources.libaistops.data.features[n+1].geometry.coordinates

  sources.route.data.features[n] = {
    type: "Feature", 
    geometry: {
      type: "LineString",
      coordinates: [origin,destination]
    }}
}

// iterate through start/end pairs and draw the arcs
for (let n = 0; n < sources.route.data.features.length; n += 1) {
  let lineDistance = turf.length(sources.route.data.features[n], {units: 'miles'})
  let arc = []
  // Number of steps to use in the arc and animation
  const steps = 500
 
  // Draw an arc between the `origin` & `destination` of the two points
  for (let i = 0; i < lineDistance; i += lineDistance / steps) {
    let segment = turf.along(sources.route.data.features[n], i, {units: 'miles'})
    arc.push(segment.geometry.coordinates)
  }
  
  // Update the route with calculated arc coordinates
  sources.route.data.features[n].geometry.coordinates = arc
}

sources.activeRoute.data = sources.route.data.features[0]

const IndexPage = () => {

  const [ focus, setFocus ] = useState(0)
  
  return (
    <Layout title="Full Screen Map">
      <Timeline 
        activeLocation={sources.libaistops.data.features[focus]}
      >
        <p>
        <button 
          onClick={() => {
            if (focus == sources.libaistops.data.features.length -1) {
              setFocus(0)
            } else {
              setFocus(focus + 1)
            }
        }}>Fly to next location</button>
        </p>
        <p>
        <button 
          onClick={() => {
              setFocus(0)
            }}>Back to the Start</button>
        </p>
      </Timeline>
      <Map2 
        sources={sources}
        layers={layers}
        center={sources.libaistops.data.features[focus].geometry.coordinates}
        styles={['ckbwr93pu1e4a1hmw0mltc38t', 'cjf8jn2jo3tmb2ro16oc6ko3q']}
        zoom={10}
        pitch={sources.libaistops.data.features[focus].properties.mapbox_pitch}
        bearing={sources.libaistops.data.features[focus].properties.mapbox_bearing}
        activeRoute={sources.route.data.features[Math.max(0,focus-1)]}
      />
    </Layout>
  )
}

export default IndexPage