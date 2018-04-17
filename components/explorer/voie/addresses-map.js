import React from 'react'
import PropTypes from 'prop-types'
import {Marker} from 'react-mapbox-gl'
import {center, bbox} from '@turf/turf'

import theme from '../../../styles/theme'

import Mapbox from '../../mapbox'

const markerStyle = {
  width: 30,
  height: 30,
  borderRadius: '50%',
  backgroundColor: '#E0E0E0',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: '2px solid #C9C9C9'
}

const selectedStyle = Object.assign({}, markerStyle, {
  width: 40,
  height: 40,
  backgroundColor: theme.primary,
  color: 'white',
  border: `2px solid ${theme.primaryDark}`
})

const selectedPosStyle = Object.assign({}, markerStyle, selectedStyle, {
  backgroundColor: theme.successBg,
  color: 'black',
  border: `2px solid ${theme.successBorder}`
})

class AddressesMap extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      bounds: null,
      boundsCenter: null
    }

    this.getCirclePaint = this.getCirclePaint.bind(this)
  }

  componentWillMount() {
    const {addresses} = this.props
    const extent = bbox(addresses)
    const boundsCenter = center(addresses).geometry.coordinates

    this.setState({
      bounds: [
        extent.splice(0, 2),
        extent.splice(0, 2)
      ],
      boundsCenter
    })
  }

  getCirclePaint() {
    return {
      'circle-radius': 15,
      'circle-color': '#3099df',
      'circle-opacity': 0.8
    }
  }

  render() {
    const {bounds, boundsCenter} = this.state
    const {addresses, selectedAddress, onSelect} = this.props

    const center = selectedAddress ?
      selectedAddress.position.coordinates :
      boundsCenter

    return (
      <Mapbox center={center} bounds={bounds} zoom={selectedAddress ? 17 : 15}>
        {addresses && addresses.features.map(feature => (
          <Marker
            key={feature.properties.numero}
            onClick={() => onSelect(feature)}
            style={selectedAddress && feature.properties.numero === selectedAddress.numero ? selectedStyle : markerStyle}
            coordinates={feature.geometry.coordinates}>
            <div title={feature.properties.numero}>
              {feature.properties.numero}
            </div>
          </Marker>
        ))}
        {selectedAddress && selectedAddress.entries.map(entry => (
          <Marker
            key={entry.source}
            style={selectedPosStyle}
            coordinates={entry.position.coordinates}>
            <div title={entry.source}>
              {entry.source}
            </div>
          </Marker>
          ))}
      </Mapbox>
    )
  }
}

AddressesMap.propTypes = {
  addresses: PropTypes.object.isRequired,
  selectedAddress: PropTypes.object,
  onSelect: PropTypes.func
}

AddressesMap.defaultProps = {
  selectedAddress: null
}

export default AddressesMap
