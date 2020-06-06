import React from 'react'

import Layout from 'components/Layout'
import Map from 'components/Map'

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
    'text-field': ['get', 'historic-name'],
    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
    'text-offset': [0, 0.6],
    'text-anchor': 'top'
  }
  }
]

const IndexPage = () => {
  return (
    <Layout title="Full Screen Map">
      <Map 
        sources={sources}
        layers={layers}
        center={[104.755, 31.771]}
        styles={['cj5baffd71bcf2ro63aiys3qo', 'cjf8jn2jo3tmb2ro16oc6ko3q']}
        zoom={6}
      />
    </Layout>
  )
}

export default IndexPage