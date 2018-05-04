import React from 'react'
import PropTypes from 'prop-types'
import {Source, Layer} from 'react-mapbox-gl'

import Mapbox from '../../mapbox'
import Events from '../../mapbox/events'

import {addressesToGeoJson, addressToGeoJson} from '../../../lib/geojson'

import Notification from '../../notification'

const EMPTY_FILTER = ['==', 'non_existing_prop', 'non_existing_value']

const circlePaint = {
  'circle-stroke-width': 1,
  'circle-stroke-color': '#DDD',
  'circle-radius': {
    base: 1.6,
    stops: [[12, 3], [22, 120]]
  },
  'circle-color': [
    'case',
    ['==', ['get', 'source'], 'ban'],
    '#FFDF51',
    ['==', ['get', 'source'], 'bano'],
    '#418864',
    ['==', ['get', 'source'], 'cadastre'],
    '#8C5FF5',
    ['==', ['get', 'destination'], 'habitation'],
    '#21BA45',
    ['==', ['get', 'destination'], 'commerce'],
    '#53DD9E',
    ['==', ['get', 'destination'], 'site-touristique'],
    '#A1003C',
    ['==', ['get', 'destination'], 'site-industriel'],
    '#a5673f',
    ['==', ['get', 'destination'], 'dependance-batie-isolee'],
    '#FBBD08',
    ['==', ['get', 'destination'], 'installations-techniques'],
    '#F2711C',
    ['==', ['get', 'destination'], 'local-commun'],
    '#00B5AD',
    ['==', ['get', 'destination'], 'divers'],
    '#DDDDDD',
    '#53657D'
  ],
  'circle-opacity': 0.8
}

class AddressesMap extends React.Component {
  constructor(props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
    this.handleDragEnd = this.handleDragEnd.bind(this)
  }

  componentWillMount() {

  }

  handleClick(map, event) {
    const {handleSelect} = this.props
    const [feature] = event.features

    this.resetFilters(map)
    handleSelect(feature)
  }

  handleMouseEnter(map, event) {
    const canvas = event.originalEvent.target
    canvas.style.cursor = 'pointer'

    const [feature] = event.features

    map.setFilter('point-hover', ['==', ['get', 'id'], feature.properties.id])
    map.setFilter('point-label', ['==', ['get', 'id'], feature.properties.id])
  }

  handleMouseLeave(map, event) {
    const canvas = event.originalEvent.target
    canvas.style.cursor = ''

    this.resetFilters(map)
  }

  handleDragEnd(map) {
    const {handleMove} = this.props
    const bounds = map.getBounds().toArray()
    const bbox = [
      bounds[0][0],
      bounds[0][1],
      bounds[1][0],
      bounds[1][1]
    ]
    handleMove(bbox)
  }

  resetFilters(map) {
    map.setFilter('point-hover', EMPTY_FILTER)
    map.setFilter('point-label', null)
    map.setFilter('point', null)
  }

  render() {
    const {addresses, addrsAround, selectedAddress} = this.props
    const data = selectedAddress ?
      addressToGeoJson(selectedAddress) :
      addressesToGeoJson(addresses)

    if (data.features.length === 0) {
      return <Notification type='error' message='No position' />
    }

    return (
      <Mapbox data={data} onStyleLoad={this.handleDragEnd}>
        <Source id='addresses-map' geoJsonSource={{
          type: 'geojson',
          data
        }} />

        <Source id='addresses-around' geoJsonSource={{
          type: 'geojson',
          data: addressesToGeoJson(addrsAround)
        }} />

        <Layer
          id='point'
          sourceId='addresses-map'
          type='circle'
          paint={circlePaint} />

        <Layer
          id='point-around'
          sourceId='addresses-around'
          type='circle'
          paint={{
            'circle-stroke-width': 2,
            'circle-stroke-color': '#DDD',
            'circle-radius': {
              base: 1.6,
              stops: [[12, 2], [22, 100]]
            },
            'circle-color': '#fff',
            'circle-opacity': 0.2
          }} />

        <Layer
          id='point-hover'
          sourceId='addresses-map'
          type='circle'
          filter={EMPTY_FILTER}
          paint={{
            'circle-stroke-width': 2,
            'circle-stroke-color': circlePaint['circle-color'],
            'circle-radius': circlePaint['circle-radius'],
            'circle-color': '#fff',
            'circle-opacity': 1
          }} />

        <Layer
          id='point-label'
          type='symbol'
          sourceId='addresses-map'
          layout={{
            'text-field': '{numero}',
            'text-anchor': 'center',
            'text-size': {
              stops: [[12, 3], [22, 18]]
            },
            'text-font': [
              'Noto Sans Regular'
            ]
          }} />

        <Layer
          id='around-label'
          type='symbol'
          sourceId='addresses-around'
          layout={{
            'text-field': '{numero}',
            'text-anchor': 'center',
            'text-size': {
              stops: [[12, 3], [22, 13]]
            },
            'text-font': [
              'Noto Sans Regular'
            ]
          }} />

        <Layer
          id='point-source'
          type='symbol'
          sourceId='addresses-map'
          filter={['has', 'source']}
          layout={{
            'text-field': '{source}',
            'text-anchor': 'center',
            'text-size': 12,
            'text-font': [
              'Noto Sans Regular'
            ]
          }} />

        <Events
          layers={['point']}
          onClick={this.handleClick}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          onDragEnd={this.handleDragEnd} />
      </Mapbox>
    )
  }
}

AddressesMap.propTypes = {
  addresses: PropTypes.array.isRequired,
  addrsAround: PropTypes.array.isRequired,
  handleMove: PropTypes.func.isRequired,
  selectedAddress: PropTypes.object,
  handleSelect: PropTypes.func
}

AddressesMap.defaultProps = {
  selectedAddress: null
}

export default AddressesMap
