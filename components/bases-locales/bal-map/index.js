/* eslint react/no-danger: off */
import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../styles/theme'

import Legend from './legend'

const popupHTML = layer => {
  return (`
      <div>
        <h3>${layer.properties.nom}</h3>
      </div>
      `)
}

class AddressMap extends React.Component {
  static propTypes = {
    map: PropTypes.object.isRequired,
    data: PropTypes.object,
    popUp: PropTypes.object,
    regions: PropTypes.object
  }

  static defaultProps = {
    data: null,
    popUp: null,
    regions: null
  }

  componentDidMount() {
    const {map} = this.props

    map.once('load', this.onLoad)

    map.on('styledata', this.onStyleData)

    map.on('mousemove', 'bal-polygon-fill', this.onMouseMove.bind(this, 'bal-polygon-fill'))
    map.on('mouseleave', 'bal-polygon-fill', this.onMouseLeave.bind(this, 'bal-polygon-fill'))

    map.on('click', 'bal-polygon-fill', this.onClick.bind(this, 'bal-polygon-fill'))
    map.on('click', 'regions-polygon-fill', this.onClick.bind(this, 'regions-polygon-fill'))
  }

  componentWillUnmount() {
    const {map} = this.props

    map.off('styledata', this.onStyleData)

    map.off('mousemove', 'bal-polygon-fill', this.onMouseMove.bind(this, 'bal-polygon-fill'))
    map.off('mouseleave', 'bal-polygon-fill', this.onMouseLeave.bind(this, 'bal-polygon-fill'))

    map.off('click', 'bal-polygon-fill', this.onClick.bind(this, 'bal-polygon-fill'))
    map.off('click', 'regions-polygon-fill', this.onClick.bind(this, 'regions-polygon-fill'))
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

  onLoad = () => {
    const {map, data, regions} = this.props

    map.addSource('data', {
      type: 'geojson',
      generateId: true,
      data
    })

    map.addSource('regions', {
      type: 'geojson',
      generateId: true,
      data: regions
    })

    map.addLayer({
      id: 'regions-polygon-fill',
      type: 'fill',
      source: 'regions',
      paint: {
        'fill-color': theme.colors.lighterGrey,
        'fill-opacity': 0.6
      },
      filter: ['==', '$type', 'Polygon']
    })

    map.addLayer({
      id: 'regions-polygon-outline',
      type: 'line',
      source: 'regions',
      paint: {
        'line-color': theme.colors.lightGrey,
        'line-width': 1
      }
    })

    map.addLayer({
      id: 'bal-polygon-fill',
      type: 'fill',
      source: 'data',
      paint: {
        'fill-color': [
          'case',
          ['==', ['get', 'licence'], 'odc-odbl'],
          theme.colors.orange,
          ['==', ['get', 'licence'], 'fr-lo'],
          theme.colors.green,
          theme.colors.red
        ],
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          0.5,
          0.1
        ]
      },
      filter: ['==', '$type', 'Polygon']
    })

    map.addLayer({
      id: 'bal-polygon-outline',
      type: 'line',
      source: 'data',
      paint: {
        'line-color': [
          'case',
          ['==', ['get', 'licence'], 'odc-odbl'],
          theme.colors.orange,
          ['==', ['get', 'licence'], 'fr-lo'],
          theme.colors.green,
          theme.colors.red
        ],
        'line-width': 2
      },
      filter: ['==', '$type', 'Polygon']
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
    const {map, popUp} = this.props
    const [feature] = event.features

    if (event.lngLat) {
      popUp.setLngLat(event.lngLat)
        .setHTML(popupHTML(feature))
        .addTo(map)
    } else {
      popUp.remove()
    }
  }

  render() {
    return (
      <Legend />
    )
  }
}

export default AddressMap
