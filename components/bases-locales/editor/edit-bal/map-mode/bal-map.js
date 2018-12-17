import React from 'react'
import PropTypes from 'prop-types'
import computeBbox from '@turf/bbox'

import theme from '../../../../../styles/theme'

class BalMap extends React.Component {
  static propTypes = {
    map: PropTypes.object.isRequired,
    voies: PropTypes.shape({
      features: PropTypes.array.isRequired
    }).isRequired,
    addresses: PropTypes.shape({
      features: PropTypes.array.isRequired
    }).isRequired,
    bounds: PropTypes.object,
    select: PropTypes.func.isRequired,
    selected: PropTypes.object
  }

  static defaultProps = {
    selected: null,
    bounds: null
  }

  componentDidMount() {
    const {map} = this.props

    map.once('load', this.onLoad)
    this.fitBounds()

    map.on('styledata', this.onStyleData)

    map.on('mousemove', 'focus', this.onMouseMove.bind(this, 'focus'))
    map.on('mouseleave', 'focus', this.onMouseLeave.bind(this, 'focus'))
    map.on('click', 'focus', this.onClick.bind(this, 'focus'))

    map.on('mousemove', 'unfocus', this.onMouseMove.bind(this, 'unfocus'))
    map.on('mouseleave', 'unfocus', this.onMouseLeave.bind(this, 'unfocus'))
    map.on('click', 'unfocus', this.onClick.bind(this, 'unfocus'))
  }

  componentDidUpdate(prevProps) {
    const {map, voies, addresses, selected} = this.props

    if (voies !== prevProps.voies) {
      const source = map.getSource('voies')

      source.setData(voies)
    }

    if (addresses !== prevProps.addresses) {
      const source = map.getSource('addresses')

      source.setData(addresses)
    }

    if (!selected && map.isStyleLoaded()) {
      map.setFilter('selected', ['any'])
      this.fitBounds()
    }

    if (selected && selected !== prevProps.selected) {
      map.setFilter('selected', ['==', ['get', 'id'], selected.id])
      map.setCenter(selected.positions[0].coords)
      map.setZoom(16)
    }
  }

  componentWillUnmount() {
    const {map} = this.props

    map.off('styledata', this.onStyleData)

    map.off('mousemove', 'focus', this.onMouseMove.bind(this, 'focus'))
    map.off('mouseleave', 'focus', this.onMouseLeave.bind(this, 'focus'))
    map.off('click', 'focus', this.onClick.bind(this, 'focus'))

    map.off('mousemove', 'unfocus', this.onMouseMove.bind(this, 'unfocus'))
    map.off('mouseleave', 'unfocus', this.onMouseLeave.bind(this, 'unfocus'))
    map.off('click', 'unfocus', this.onClick.bind(this, 'unfocus'))
  }

  fitBounds = () => {
    const {map, voies, addresses, bounds} = this.props
    const bbox = computeBbox(bounds || voies || addresses)

    map.fitBounds(bbox, {
      padding: 30,
      linear: true,
      maxZoom: 16,
      duration: 0
    })
  }

  onStyleData = () => {
    const {map} = this.props

    if (map.isStyleLoaded()) {
      if (!map.getSource('voies') || !map.getSource('addresses')) {
        this.onLoad()
      }
    } else {
      setTimeout(this.onStyleData, 1000)
    }
  }

  onLoad = () => {
    const {map, voies, addresses} = this.props

    map.addSource('voies', {
      type: 'geojson',
      data: voies
    })

    map.addSource('addresses', {
      type: 'geojson',
      data: addresses
    })

    map.addLayer({
      id: 'addresses-circle',
      type: 'circle',
      source: 'addresses',
      paint: {
        'circle-color': theme.colors.lightGrey,
        'circle-radius': 5,
        'circle-stroke-color': theme.colors.darkGrey
      }
    })

    map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'voies',
      layout: {
        'text-field': [
          'format',
          ['upcase', ['get', 'voieName']],
          {'font-scale': 0.8},
          '\n',
          {},
          ['downcase', ['get', 'numerosCount']],
          {'font-scale': 0.6},
          ' numéros',
          {'font-scale': 0.6}
        ],
        'text-anchor': 'top',
        'text-font': ['Roboto bold']
      }
    })
  }

  onMouseMove = (layer, event) => {
    const {map} = this.props
    const canvas = map.getCanvas()
    canvas.style.cursor = 'pointer'

    const [feature] = event.features

    if (this.highlighted) {
      map.setFeatureState({source: 'data', id: this.highlighted}, {hover: false})
    }

    this.highlighted = feature.id
    map.setFeatureState({source: 'data', id: this.highlighted}, {hover: true})
  }

  onMouseLeave = () => {
    const {map} = this.props
    const canvas = map.getCanvas()
    canvas.style.cursor = ''

    if (this.highlighted) {
      map.setFeatureState({source: 'data', id: this.highlighted}, {hover: false})
    }
  }

  onClick = (layer, event) => {
    const {map, select} = this.props
    const [feature] = event.features
    const {codeCommune, codeVoie, numeroComplet} = feature.properties

    map.setCenter(event.lngLat)
    map.setZoom(16)

    select(codeCommune, codeVoie, numeroComplet)
  }

  render() {
    return null
  }
}

export default BalMap
