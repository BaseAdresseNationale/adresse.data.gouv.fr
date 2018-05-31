/* eslint react/no-danger: off */
import React from 'react'
import PropTypes from 'prop-types'
import {Marker, Popup} from 'react-mapbox-gl'

import CenteredMap from './centered-map'
import Feature from './feature'

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

const zoomLevel = {
  street: 16,
  housenumber: 18,
  locality: 15
}

const AddressMap = ({address}) => {
  const center = address ? address.geometry.coordinates : [2.060204, 49.031407]
  const zoom = address ? zoomLevel[address.properties.type] : 13

  return (
    <CenteredMap zoom={zoom} center={center} fullscreen>
      <Marker
        style={markerStyle}
        coordinates={center} />

      {address &&
        <Popup
          anchor='top'
          coordinates={center}
          offset={50}>
          <Feature properties={address.properties} />
        </Popup>
      }
    </CenteredMap >
  )
}

AddressMap.propTypes = {
  address: PropTypes.object
}

AddressMap.defaultProps = {
  address: null
}

export default AddressMap
