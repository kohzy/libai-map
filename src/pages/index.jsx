import React, { useState } from 'react'
import * as turf from '@turf/turf'

import Layout from 'components/Layout'
import { Box, Flex } from 'components/Grid'
import Drawer from 'components/Drawer'
import ControlBar from 'components/ControlBar'
import Map2 from 'components/Map2'

import styled from 'style'

import GeoJSONData from 'data/libai-stop.json'

// this wrapper needs to be 100% to force map and sidebar to fill the full space
const Wrapper = styled(Flex)`
  height: 100%;
`

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
    'icon-image': 'embassy-15',
    'icon-size': 1.5,
    // get the title name from the source's "historic-name" property
    'text-field': ['get', 'title'],
    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
    'text-offset': [0, 1],
    'text-anchor': 'top',
    'text-size': 25
    },
  paint: {
    'text-color': "rgba(230, 94, 13,0.9)",
    'text-halo-color': "rgba(255, 255, 255,0.7)",
    'text-halo-width': 0.3
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
  const siteTitle = "Following the Banished Immortal"
  
  return (
    <Layout title= {siteTitle}>
      <Wrapper>
        <Drawer 
          title= {siteTitle}
          activeLocation={sources.libaistops.data.features[focus]}
        >
          <ControlBar 
            backStartFunc={() => {
              setFocus(0)
            }}
            prevFunc={() => {
              if (focus == 0) {
              } else {
                setFocus(focus - 1)
              }
            }}
            nextFunc={() => {
              if (focus == sources.libaistops.data.features.length -1) {
                setFocus(0)
              } else {
                setFocus(focus + 1)
              }
            }}
          />       
        </Drawer>
        <Map2 
          sources={sources}
          layers={layers}
          center={sources.libaistops.data.features[focus].geometry.coordinates}
          styles={['ckbwr93pu1e4a1hmw0mltc38t']}
          zoom={10}
          pitch={sources.libaistops.data.features[focus].properties.mapbox_pitch}
          bearing={sources.libaistops.data.features[focus].properties.mapbox_bearing}
          activeRoute={sources.route.data.features[Math.max(0,focus-1)]}
        />
      </Wrapper>
    </Layout>
  )
}

export default IndexPage