/* eslint react/no-danger: off */
import React from 'react'
import PropTypes from 'prop-types'
import {isEqual} from 'lodash'

import theme from '../../styles/theme'

import Loader from '../loader'

const popupHTML = address => {
  const {id, context, label, name, postcode, citycode, type, city} = address.properties
  const types = {
    locality: 'Lieu-dit',
    street: 'Voie',
    housenumber: 'Numéro'
  }

  return (`
      <div>
        <h3>${types[type]}</h3>
        <p>
          <div>${name}</div>
          <div>${postcode} ${city}</div>
          <div>Code INSEE : ${citycode}</div>
        </p>
        <div>Contexte : ${context}</div>
        <div>Label : ${label}</div>
        <div>ID : ${id}</div>
      </div>
      `)
}

class AddressMap extends React.Component {
  static propTypes = {
    map: PropTypes.object.isRequired,
    marker: PropTypes.object.isRequired,
    data: PropTypes.object,
    loading: PropTypes.bool,
    center: PropTypes.array,
    zoom: PropTypes.number,
    mapUpdate: PropTypes.func.isRequired
  }

  static defaultProps = {
    data: true,
    loading: false,
    center: null,
    zoom: null
  }

  componentDidMount() {
    const {map, zoom, center} = this.props

    map.setZoom(zoom)
    map.setCenter(center)

    map.once('load', this.onLoad)

    map.on('styledata', this.onStyleData)

    map.on('dragend', this.onDragEnd.bind(this))
    map.on('zoom', this.onZoom.bind(this))
  }

  componentDidUpdate(prevProps) {
    const {map, data, center, zoom} = this.props

    if (!isEqual(data, prevProps.data)) {
      this.updateMarker()
    }

    if (center !== prevProps.center) {
      map.setCenter(center)
    }

    if (zoom !== prevProps.zoom) {
      map.setZoom(zoom)
    }
  }

  componentWillUnmount() {
    const {map} = this.props

    map.off('styledata', this.onStyleData)

    map.off('dragend', this.onDragEnd.bind(this))
    map.off('zoom', this.onZoom.bind(this))
  }

  onStyleData = () => {
    const {map} = this.props

    if (map.isStyleLoaded()) {
      if (!map.getSource('data')) {
        this.onLoad()
      }
    } else {
      setTimeout(this.onStyleData, 1000)
    }
  }

  updateMarker = () => {
    const {map, marker, data} = this.props
    const popup = marker.getPopup()

    if (data) {
      marker.setLngLat(data.geometry.coordinates)
      popup.setHTML(popupHTML(data))
      marker.addTo(map)
    } else {
      marker.setLngLat([0, 0])
    }
  }

  onLoad = () => {
    this.updateMarker()
  }

  onDragEnd = () => {
    const {map, mapUpdate} = this.props
    const {lng, lat} = map.getCenter()
    const zoom = map.getZoom()

    mapUpdate([lng, lat], zoom, true)
  }

  onZoom = () => {
    const {map, mapUpdate} = this.props
    const {lng, lat} = map.getCenter()
    const zoom = map.getZoom()

    mapUpdate([lng, lat], zoom, false)
  }

  render() {
    const {loading} = this.props

    return (
      <div>
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
            margin-top: 50px;
            width: 40px;
            height: 40px;
          }

          .map-center:before, .map-center:after {
            content: "";
            position: absolute;
            z-index: 1;
            background: ${theme.border};
          }

          .map-center:before {
            left: 50%;
            width: 2px;
            height: 100%;
          }

          .map-center:after {
            top: 50%;
            height: 2px;
            width: 100%;
          }
        `}</style>
      </div>
    )
  }
}

export default AddressMap
