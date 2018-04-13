/* eslint react/no-danger: off, react/style-prop-object: off */
import React from 'react'
import PropTypes from 'prop-types'
import ReactMapboxGl from 'react-mapbox-gl'

// eslint-disable-next-line new-cap
const Map = ReactMapboxGl({})

const fullscreenStyle = {
  height: '100vh',
  width: '100vw'
}

const containerStyle = {
  height: '100%',
  width: '100%',
  boxShadow: '0 1px 4px #C9D3DF'
}

const Mapbox = ({center, zoom, bounds, fullscreen, children}) => {
  return (
    <Map
      style='https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json'
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
  zoom: 11,
  bounds: null,
  fullscreen: false,
  children: null
}

export default Mapbox
