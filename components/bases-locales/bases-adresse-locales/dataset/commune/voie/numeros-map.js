import React from 'react'
import PropTypes from 'prop-types'
import computeBbox from '@turf/bbox'

import theme from '../../../../../../styles/theme'

const circlePaint = {
  'circle-stroke-width': 1,
  'circle-stroke-color': '#DDD',
  'circle-radius': {
    base: 1.6,
    stops: [[12, 3], [22, 120]]
  },
  'circle-color': theme.colors.white,
  'circle-opacity': 0.8
}

class NumerosMap extends React.Component {
  static propTypes = {
    map: PropTypes.object.isRequired,
    data: PropTypes.shape({
      features: PropTypes.array.isRequired
    }).isRequired
  }

  componentDidMount() {
    const {map} = this.props

    map.once('load', this.onLoad)

    map.on('styledata', this.onStyleData)

    this.fitBounds()
  }

  componentWillUnmount() {
    const {map} = this.props

    map.off('styledata', this.onStyleData)
  }

  onStyleData = () => {
    const {map} = this.props

    if (map.isStyleLoaded()) {
      if (!map.getSource('numeros')) {
        this.onLoad()
      }
    } else {
      setTimeout(this.onStyleData, 1000)
    }
  }

  fitBounds = () => {
    const {map, data} = this.props
    const bbox = computeBbox(data)

    map.fitBounds(bbox, {
      padding: 30,
      linear: true,
      maxZoom: 16,
      duration: 0
    })
  }

  onLoad = () => {
    const {map, data} = this.props

    map.addSource('numeros', {
      type: 'geojson',
      generateId: true,
      data
    })

    map.addLayer({
      id: 'point',
      source: 'numeros',
      type: 'circle',
      paint: circlePaint
    })

    map.addLayer({
      id: 'point-label',
      source: 'numeros',
      type: 'symbol',
      layout: {
        'text-field': '{numero}',
        'text-anchor': 'center',
        'text-size': {
          stops: [[12, 3], [22, 18]]
        },
        'text-font': [
          'Noto Sans Regular'
        ]
      }
    })
  }

  render() {
    return null
  }
}

export default NumerosMap
