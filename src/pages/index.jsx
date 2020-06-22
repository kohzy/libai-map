import React, { useState } from 'react'

import Layout from 'components/Layout'
import Timeline from 'components/Timeline/timeline'
import Map2 from 'components/Map2'

import GeoJSONData from 'data/libai-stop.json'

const sources = {
  libaistops: {
    type: "geojson",
    data: GeoJSONData
  }
}

const layers = [{
  'id': 'points',
  'type': 'symbol',
  'source': 'libaistops',
  'layout': {
    'icon-image': 'monument-15',
    // get the title name from the source's "historic-name" property
    'text-field': ['get', 'title'],
    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
    'text-offset': [0, 0.6],
    'text-anchor': 'top'
  }
  }
]

const IndexPage = () => {

  const [ focus, setFocus ] = useState(0)
  
  return (
    <Layout title="Full Screen Map">
      <Timeline>
        <button onClick={() => {
          setFocus(focus + 1);
          console.log(focus)
        }}>Fly to Suyab2</button>
      </Timeline>
      <Map2 
        sources={sources}
        layers={layers}
        center={sources.libaistops.data.features[focus].geometry.coordinates}
        styles={['cj5baffd71bcf2ro63aiys3qo', 'cjf8jn2jo3tmb2ro16oc6ko3q']}
        zoom={15}
        pitch={sources.libaistops.data.features[focus].properties.mapbox_pitch}
        bearing={sources.libaistops.data.features[focus].properties.mapbox_bearing}
      />
    </Layout>
  )
}

export default IndexPage