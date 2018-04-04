/* eslint react/no-danger: off */
import React from 'react'
import PropTypes from 'prop-types'
import getConfig from 'next/config'
import ReactMapboxGl from 'react-mapbox-gl'

// eslint-disable-next-line new-cap
const Map = ReactMapboxGl({})

const {publicRuntimeConfig: {
  TILEHOSTING_KEY
}} = getConfig()

const fullscreenStyle = {
  height: '100vh',
  width: '100vw'
}

const containerStyle = {
  height: '100%',
  width: '100%'
}

const Mapbox = ({center, zoom, bounds, fullscreen, children}) => {
  return (
    <Map
      style={`https://free.tilehosting.com/styles/bright/style.json?key=${TILEHOSTING_KEY}`}
      zoom={[zoom]}
      center={center}
      fitBounds={bounds}
      fitBoundsOptions={{padding: 20, linear: true}}
      containerStyle={fullscreen ? fullscreenStyle : containerStyle}>
      {children}
    </Map>
  )
}

Mapbox.propTypes = {
  center: PropTypes.array,
  zoom: PropTypes.number,
  bounds: PropTypes.array,
  fullscreen: PropTypes.bool,
  children: PropTypes.node
}

Mapbox.defaultProps = {
  center: [2.060204, 49.031407],
  zoom: 13,
  bounds: null,
  fullscreen: false,
  children: null
}

export default Mapbox
