import React from 'react'
import PropTypes from 'prop-types'
import computeBbox from '@turf/bbox'
import {isEqual} from 'lodash'

import theme from '../../../styles/theme'

import Notification from '../../notification'

import Address from './address'

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

const labelLayout = {
  'text-field': '{numero}',
  'text-anchor': 'center',
  'text-size': {
    stops: [[12, 3], [22, 13]]
  },
  'text-font': [
    'Noto Sans Regular'
  ]
}

class AddressesMap extends React.Component {
  static propTypes = {
    map: PropTypes.object.isRequired,
    data: PropTypes.shape({
      features: PropTypes.array.isRequired
    }).isRequired,
    selected: PropTypes.object,
    voie: PropTypes.object.isRequired,
    addrsAround: PropTypes.shape({
      features: PropTypes.array.isRequired
    }).isRequired,
    onClose: PropTypes.func.isRequired,
    handleMove: PropTypes.func.isRequired,
    handleSelect: PropTypes.func
  }

  static defaultProps = {
    selected: null,
    handleSelect: null
  }

  componentDidMount() {
    const {map} = this.props

    map.once('load', this.onLoad)
    this.fitBounds()

    map.on('styledata', this.styleData)

    map.on('mouseenter', 'point', this.onMouseEnter.bind(this, 'point'))
    map.on('mouseleave', 'point', this.onMouseLeave.bind(this, 'point'))
    map.on('click', 'point', this.onClick.bind(this, 'point'))
    map.on('click', 'focus', this.onClick.bind(this, 'focus'))
    map.on('click', 'unfocus', this.onClick.bind(this, 'unfocus'))

    map.on('dragend', this.onDragEnd.bind(this))
  }

  componentDidUpdate(prevProps) {
    const {map, data, selected, addrsAround} = this.props

    if (!isEqual(addrsAround, prevProps.addrsAround)) {
      const source = map.getSource('addresses-around')

      source.setData(addrsAround)
    }

    if (!isEqual(data, prevProps.data)) {
      const source = map.getSource('data')

      source.setData(data)
    }

    if (selected || selected !== prevProps.selected) {
      this.fitBounds()
    }
  }

  componentWillUnmount() {
    const {map} = this.props

    map.off('styledata', this.styleData)

    map.off('mouseenter', 'point', this.onMouseEnter.bind(this, 'point'))
    map.off('mouseleave', 'point', this.onMouseLeave.bind(this, 'point'))

    map.off('click', 'point', this.onClick.bind(this, 'point'))
    map.off('click', 'focus', this.onClick.bind(this, 'focus'))
    map.off('click', 'unfocus', this.onClick.bind(this, 'unfocus'))

    map.off('dragend', this.onDragEnd.bind(this))
  }

  fitBounds = () => {
    const {map, data} = this.props
    const bbox = computeBbox(data)

    map.fitBounds(bbox, {
      padding: 30,
      linear: true,
      maxZoom: 19,
      duration: 0
    })
  }

  styleData = () => {
    const {map} = this.props

    if (map.isStyleLoaded()) {
      if (!map.getSource('data')) {
        this.onLoad()
      }
    } else {
      setTimeout(this.styleData, 1000)
    }
  }

  onLoad = () => {
    const {map, data, addrsAround} = this.props

    map.addSource('data', {
      type: 'geojson',
      generateId: true,
      data
    })

    map.addSource('addresses-around', {
      type: 'geojson',
      generateId: true,
      data: addrsAround
    })

    map.addLayer({
      id: 'point',
      source: 'data',
      type: 'circle',
      paint: circlePaint
    })

    map.addLayer({
      id: 'point-around',
      source: 'addresses-around',
      type: 'circle',
      paint: {
        'circle-stroke-width': 2,
        'circle-stroke-color': '#DDD',
        'circle-radius': {
          base: 1.6,
          stops: [[12, 2], [22, 100]]
        },
        'circle-color': '#fff',
        'circle-opacity': 0.2
      }
    })

    map.addLayer({
      id: 'point-hover',
      source: 'data',
      type: 'circle',
      filter: EMPTY_FILTER,
      paint: {
        'circle-stroke-width': 2,
        'circle-stroke-color': circlePaint['circle-color'],
        'circle-radius': circlePaint['circle-radius'],
        'circle-color': '#fff',
        'circle-opacity': 1
      }
    })

    map.addLayer({
      id: 'point-label',
      type: 'symbol',
      source: 'data',
      layout: labelLayout
    })

    map.addLayer({
      id: 'around-label',
      type: 'symbol',
      source: 'addresses-around',
      layout: labelLayout
    })

    map.addLayer({
      id: 'point-source',
      type: 'symbol',
      source: 'data',
      filter: ['has', 'source'],
      layout: {
        'text-field': '{source}',
        'text-anchor': 'center',
        'text-size': 12,
        'text-font': [
          'Noto Sans Regular'
        ]
      }
    })

    this.onDragEnd()
  }

  onClick = (layer, event) => {
    const {map, handleSelect} = this.props
    const [feature] = event.features

    this.resetFilters(map)
    handleSelect(feature)
  }

  onMouseEnter = (layer, event) => {
    const {map} = this.props
    const canvas = event.originalEvent.target
    canvas.style.cursor = 'pointer'

    const [feature] = event.features

    map.setFilter('point-hover', ['==', ['get', 'id'], feature.properties.id])
    map.setFilter('point-label', ['==', ['get', 'id'], feature.properties.id])
  }

  onMouseLeave = (layer, event) => {
    const canvas = event.originalEvent.target
    canvas.style.cursor = ''

    this.resetFilters()
  }

  onDragEnd = () => {
    const {map, handleMove} = this.props
    const bounds = map.getBounds().toArray()
    const bbox = [
      bounds[0][0],
      bounds[0][1],
      bounds[1][0],
      bounds[1][1]
    ]

    handleMove(bbox)
  }

  resetFilters() {
    const {map} = this.props

    map.setFilter('point-hover', EMPTY_FILTER)
    map.setFilter('point-label', null)
    map.setFilter('point', null)
  }

  render() {
    const {data, selected, voie, onClose} = this.props

    if (data.features.length === 0) {
      return <Notification type='error' message='No position' />
    }

    return (
      <div>
        {selected && (
          <div className='selected-address'>
            <Address
              voie={voie}
              address={selected}
              onClose={onClose}
            />
          </div>
        )}

        <style jsx>{`
          .selected-address {
            min-width: 200px;
            padding: 0 2em;
            overflow: scroll;
            height: 100%;
            box-shadow: 0 1px 4px ${theme.boxShadow};
          }
        `}</style>
      </div>
    )
  }
}

export default AddressesMap
