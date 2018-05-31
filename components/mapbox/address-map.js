/* eslint react/no-danger: off */
import React from 'react'
import PropTypes from 'prop-types'
import {Marker} from 'react-mapbox-gl'

import CenteredMap from './centered-map'

const markerStyle = {
  zIndex: 0,
  width: 30,
  height: 30,
  borderRadius: '50%',
  backgroundColor: '#E54E52',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: '2px solid #a92d2d'
}

const AddressMap = ({center, zoom}) => (
  <CenteredMap zoom={zoom} center={center} fullscreen>
    <Marker
      style={markerStyle}
      coordinates={center} />
  </CenteredMap >
)

AddressMap.propTypes = {
  center: PropTypes.array,
  zoom: PropTypes.number
}

AddressMap.defaultProps = {
  center: [2.060204, 49.031407],
  zoom: 15
}

export default AddressMap
