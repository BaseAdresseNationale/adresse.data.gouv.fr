/* eslint react/no-danger: off */
import React from 'react'
import PropTypes from 'prop-types'
import {Marker} from 'react-mapbox-gl'

import CenteredMap from './centered-map'
import PopupAddress from './popup-address'

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

class AddressMap extends React.Component {
  static propTypes = {
    address: PropTypes.object
  }

  static defaultProps = {
    address: true
  }

  state = {
    displayPopup: false
  }

  handlePopup = () => {
    this.setState(state => ({
      displayPopup: !state.displayPopup
    }))
  }

  render() {
    const {address} = this.props
    const {displayPopup} = this.state
    const center = address ? address.geometry.coordinates : [1.7191, 46.7111]
    const zoom = address ? zoomLevel[address.properties.type] : 5

    return (
      <CenteredMap zoom={zoom} center={center} fullscreen>
        {address &&
          <Marker
            style={markerStyle}
            coordinates={center}
            onMouseEnter={this.handlePopup}
            onMouseLeave={this.handlePopup}
            onClick={this.handlePopup} />}

        {address && displayPopup &&
          <PopupAddress address={address} onClose={this.handlePopup} />
        }
      </CenteredMap >
    )
  }
}

export default AddressMap
