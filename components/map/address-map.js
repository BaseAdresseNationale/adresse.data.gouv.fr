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
    forcePopupDisplay: false,
    displayPopup: false
  }

  handleClick = () => {
    this.setState(state => ({
      forcePopupDisplay: !state.forcePopupDisplay
    }))
  }

  handleMouseEnter = () => {
    this.setState(() => ({
      displayPopup: true
    }))
  }

  handleMouseLeave = () => {
    this.setState(() => ({
      displayPopup: false
    }))
  }

  handleClose = () => {
    this.setState(() => ({
      forcePopupDisplay: false,
      displayPopup: false
    }))
  }

  render() {
    const {address} = this.props
    const {displayPopup, forcePopupDisplay} = this.state
    const center = address ? address.geometry.coordinates : [1.7191, 46.7111]
    const zoom = address ? zoomLevel[address.properties.type] : 5

    return (
      <CenteredMap zoom={zoom} center={center} fullscreen>
        {address &&
          <Marker
            style={markerStyle}
            coordinates={center}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
            onClick={this.handleClick} />}

        {address && (displayPopup || forcePopupDisplay) &&
          <PopupAddress address={address} onClose={this.handleClose} />
        }
      </CenteredMap >
    )
  }
}

export default AddressMap
