/* eslint-disable max-len, no-underscore-dangle */
import React from 'react'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

import styled from 'style'
import { hasWindow } from 'util/dom'
import { getCenterAndZoom } from './util'
import StyleSelector from './StyleSelector'

import { siteMetadata } from '../../../gatsby-config'

// This wrapper must be positioned relative for the map to be able to lay itself out properly
const Wrapper = styled.div`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  position: relative;
  flex: 1 0 auto;
`
const { mapboxToken } = siteMetadata

class Map2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    this.mapRef = React.createRef();
    this.mapNode = React.createRef();
  }
  componentDidUpdate() {
    let newData = this.props.activeRoute
    this.map.getSource('activeRoute').setData(newData)

    this.map.flyTo({
        speed: 1.75,
        bearing: this.props.bearing,
        center: this.props.center,
        zoom: this.props.zoom,
        pitch: this.props.pitch
        })
  }
  
  componentDidMount() {
    let mapCenter = this.props.center
    let mapZoom = this.props.zoom
    mapboxgl.accessToken = mapboxToken

    if (this.props.bounds && this.props.bounds.length === 4) {
      const { center: boundsCenter, zoom: boundsZoom } = getCenterAndZoom(
        this.mapNode.current,
        this.props.bounds,
        this.props.padding
      )
      mapCenter = boundsCenter
      mapZoom = boundsZoom
    }

    this.map = new mapboxgl.Map({
      container: this.mapNode.current,
      style: `mapbox://styles/kohzy/${this.props.styles[0]}`,
      center: mapCenter,
      zoom: mapZoom,
      minZoom: this.props.minZoom,
      maxZoom: this.props.maxZoom,
    })
    this.mapRef.current = this.map
    window.map = this.map // for easier debugging and querying via console

    this.map.addControl(new mapboxgl.NavigationControl(), 'top-right')

    if (this.props.styles.length > 1) {
      this.map.addControl(
        new StyleSelector({
          styles: this.props.styles,
          token: mapboxToken,
        }),
        'bottom-left'
      )
    }

    this.map.on('load', () => {
      // add sources
      Object.entries(this.props.sources).forEach(([id, source]) => {
        this.map.addSource(id, source)
      })

      // add layers
      this.props.layers.forEach(layer => {
        this.map.addLayer(layer)
      })
    })
  }

  componentWillUnmount() {
    this.map.remove()
  }

  render() {
    if (!mapboxToken) {
      console.error(
        'ERROR: Mapbox token is required in gatsby-config.js siteMetadata'
      )
    }
  
    // if there is no window, we cannot render this component
    if (!hasWindow) {
      return null
    }

    return (
      <Wrapper width={this.props.width} height={this.props.height}>
        <div ref={this.mapNode} style={{ width: '100%', height: '100%' }} />
      </Wrapper>
    )
  }
}

Map2.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  center: PropTypes.arrayOf(PropTypes.number),
  zoom: PropTypes.number,
  bearing: PropTypes.number,
  pitch: PropTypes.number,
  bounds: PropTypes.arrayOf(PropTypes.number),
  minZoom: PropTypes.number,
  maxZoom: PropTypes.number,
  styles: PropTypes.arrayOf(PropTypes.string),
  padding: PropTypes.number,
  sources: PropTypes.object,
  layers: PropTypes.arrayOf(PropTypes.object),
  activeRoute: PropTypes.object,
}

Map2.defaultProps = {
  width: 'auto',
  height: '100%',
  center: [0, 0],
  zoom: 10,
  bearing: 30,
  pitch: 0,
  bounds: null,
  minZoom: 0,
  maxZoom: 24,
  styles: ['cjf8jn2jo3tmb2ro16oc6ko3q', 'cj5baffd71bcf2ro63aiys3qo'],
  padding: 0.1, // padding around bounds as a proportion
  sources: {},
  layers: [],
  activeRoute: 0,
}

export default Map2
