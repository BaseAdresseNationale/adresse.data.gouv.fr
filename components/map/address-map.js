/* eslint react/no-danger: off */
import React from 'react'
import PropTypes from 'prop-types'
import {Marker} from 'react-mapbox-gl'

import theme from '../../styles/theme'

import Loader from '../loader'

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

class AddressMap extends React.Component {
  static propTypes = {
    address: PropTypes.object,
    loading: PropTypes.bool,
    center: PropTypes.array,
    zoom: PropTypes.number,
    mapUpdate: PropTypes.func.isRequired
  }

  static defaultProps = {
    address: true,
    loading: false
  }

  state = {
    displayPopup: true
  }

  handleDrag = map => {
    const {mapUpdate} = this.props
    const {lng, lat} = map.getCenter()
    const zoom = map.getZoom()

    mapUpdate([lng, lat], zoom, true)
  }

  handleZoom = map => {
    const {mapUpdate} = this.props
    const {lng, lat} = map.getCenter()
    const zoom = map.getZoom()

    this.setState({
      displayPopup: false
    })

    mapUpdate([lng, lat], zoom, false)
  }

  handleClick = () => {
    this.setState(state => ({
      displayPopup: !state.displayPopup
    }))
  }

  handleClose = () => {
    this.setState(() => ({
      displayPopup: false
    }))
  }

  render() {
    const {address, center, zoom, loading} = this.props
    const {displayPopup} = this.state

    return (
      <CenteredMap
        zoom={zoom}
        center={center}
        onDrag={this.handleDrag}
        onZoom={this.handleZoom}
        onClick={this.handleClose}
        fullscreen>

        {address &&
          <Marker
            style={markerStyle}
            coordinates={address.geometry.coordinates} />}

        {address && displayPopup &&
          <PopupAddress address={address} />}

        {loading ?
          <div className='centered'><Loader /></div> :
          <div className='map-center centered' onClick={this.handleClick} />
        }

        <style jsx>{`
          .centered {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }

          .map-center {
            z-index: 1;
            margin-top: -15px;
            width: 100px;
            height: 100px;
          }

          .map-center:before, .map-center:after {
            content: "";
            position: absolute;
            z-index: 1;
            background: ${theme.border};
          }

          .map-center:before {
            left: 50%;
            width: 1px;
            margin-left: 0px;
            height: 100%;
          }

          .map-center:after {
            top: 50%;
            height: 1px;
            margin-top: 25x;
            width: 100%;
          }
        `}</style>
      </CenteredMap>
    )
  }
}

export default AddressMap
