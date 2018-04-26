import React from 'react'
import PropTypes from 'prop-types'
import {Source, Layer} from 'react-mapbox-gl'

import Mapbox from '../../mapbox'
import Events from '../../mapbox/events'

import {addressToGeoJson} from '../../../lib/geojson'

const EMPTY_FILTER = ['==', 'non_existing_prop', 'non_existing_value']

const circlePaint = {
  'circle-stroke-width': 1,
  'circle-stroke-color': '#DDD',
  'circle-radius': 13,
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
    this.onClick = this.onClick.bind(this)
    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
  }

  onClick(map, event) {
    const {handleSelect} = this.props
    const [feature] = event.features
    handleSelect(feature)
  }

  onMouseEnter(map, event) {
    const canvas = event.originalEvent.target
    canvas.style.cursor = 'pointer'

    const [feature] = event.features
    // Hide other points and numbers
    map.setFilter('point-hover', ['!=', ['get', 'id'], feature.properties.id])
    map.setFilter('point-label', EMPTY_FILTER)

    // Focus point and number
    map.setFilter('point', ['==', ['get', 'id'], feature.properties.id])
    map.setFilter('point-label', ['==', ['get', 'id'], feature.properties.id])
  }

  onMouseLeave(map, event) {
    const canvas = event.originalEvent.target
    canvas.style.cursor = ''

    map.setFilter('point-hover', EMPTY_FILTER)
    map.setFilter('point-label', null)
    map.setFilter('point', null)
  }

  render() {
    const {addresses, selectedAddress} = this.props

    const data = selectedAddress ?
      addressToGeoJson(selectedAddress) :
      addresses

    return (
      <Mapbox data={data}>
        <Source id='addresses-map' geoJsonSource={{
          type: 'geojson',
          data
        }} />

        <Layer
          id='point'
          sourceId='addresses-map'
          type='circle'
          paint={circlePaint} />

        <Layer
          id='point-hover'
          sourceId='addresses-map'
          type='circle'
          filter={EMPTY_FILTER}
          paint={{
            'circle-stroke-width': 1,
            'circle-stroke-color': '#DDD',
            'circle-radius': 13,
            'circle-color': '#C9D3DF',
            'circle-opacity': 0.4
          }} />

        <Layer
          id='point-label'
          type='symbol'
          sourceId='addresses-map'
          layout={{
            'text-field': '{numero}',
            'text-anchor': 'center',
            'text-size': 12,
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
          onClick={this.onClick}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave} />

        <style jsx>{`
          .info {
            position: absolute;
            pointer-events: none;
            top: 10px;
            left: 10px;
            max-width: 40%;
            overflow: hidden;
          }
        `}</style>
      </Mapbox>
    )
  }
}

AddressesMap.propTypes = {
  addresses: PropTypes.object.isRequired,
  selectedAddress: PropTypes.object,
  handleSelect: PropTypes.func
}

AddressesMap.defaultProps = {
  selectedAddress: null
}

export default AddressesMap
