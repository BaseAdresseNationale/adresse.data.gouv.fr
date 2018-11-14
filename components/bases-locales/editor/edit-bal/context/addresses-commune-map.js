import React from 'react'
import PropTypes from 'prop-types'
import computeBbox from '@turf/bbox'

import theme from '../../../../../styles/theme'

const getCircleColor = () => {
  return [
    'case',
    ['boolean', ['feature-state', 'hover'], false],
    theme.secondaryDarken,
    ['boolean', ['get', 'created'], false],
    theme.successBorder,
    ['boolean', ['get', 'edited'], false],
    theme.warningBorder,
    ['boolean', ['get', 'deleted'], false],
    theme.errorBorder,
    theme.colors.lightGrey
  ]
}

const getCircleColorFocus = () => {
  return [
    'case',
    ['boolean', ['feature-state', 'hover'], false],
    theme.secondaryDarken,
    ['boolean', ['get', 'created'], false],
    theme.successBorder,
    ['boolean', ['get', 'edited'], false],
    theme.warningBorder,
    ['boolean', ['get', 'deleted'], false],
    theme.errorBorder,
    theme.primary
  ]
}

const circleRadius = () => {
  return {
    stops: [
      [10, 2],
      [12, 4],
      [15, 10],
      [18, 16],
      [22, 20]
    ]
  }
}

class AddressesCommuneMap extends React.Component {
  static propTypes = {
    map: PropTypes.object.isRequired,
    data: PropTypes.shape({
      features: PropTypes.array.isRequired
    }).isRequired,
    bounds: PropTypes.object,
    codeVoie: PropTypes.string,
    select: PropTypes.func.isRequired,
    selected: PropTypes.object
  }

  static defaultProps = {
    selected: null,
    bounds: null,
    codeVoie: null
  }

  componentDidMount() {
    const {map} = this.props

    map.once('load', this.onLoad)
    this.fitBounds()

    map.on('styledata', this.styleData)

    map.on('mousemove', 'focus', this.onMouseMove.bind(this, 'focus'))
    map.on('mouseleave', 'focus', this.onMouseLeave.bind(this, 'focus'))
    map.on('click', 'focus', this.onClick.bind(this, 'focus'))

    map.on('mousemove', 'unfocus', this.onMouseMove.bind(this, 'unfocus'))
    map.on('mouseleave', 'unfocus', this.onMouseLeave.bind(this, 'unfocus'))
    map.on('click', 'unfocus', this.onClick.bind(this, 'unfocus'))
  }

  componentDidUpdate(prevProps) {
    const {map, data, selected} = this.props

    if (data !== prevProps.data) {
      const source = map.getSource('data')

      source.setData(data)
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

    map.off('styledata', this.styleData)

    map.off('mousemove', 'focus', this.onMouseMove.bind(this, 'focus'))
    map.off('mouseleave', 'focus', this.onMouseLeave.bind(this, 'focus'))
    map.off('click', 'focus', this.onClick.bind(this, 'focus'))

    map.off('mousemove', 'unfocus', this.onMouseMove.bind(this, 'unfocus'))
    map.off('mouseleave', 'unfocus', this.onMouseLeave.bind(this, 'unfocus'))
    map.off('click', 'unfocus', this.onClick.bind(this, 'unfocus'))
  }

  fitBounds = () => {
    const {map, data, bounds} = this.props
    const bbox = computeBbox(bounds || data)

    map.fitBounds(bbox, {
      padding: 30,
      linear: true,
      maxZoom: 16,
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
    const {map, data, codeVoie} = this.props

    map.addSource('data', {
      type: 'geojson',
      generateId: true,
      data
    })

    if (codeVoie) {
      map.addLayer({
        id: 'focus',
        type: 'circle',
        source: 'data',
        filter: [
          'all',
          ['has', 'codeVoie'],
          ['==', ['get', 'codeVoie'], codeVoie]
        ],
        paint: {
          'circle-color': getCircleColorFocus(),
          'circle-stroke-width': 1,
          'circle-stroke-color': theme.colors.darkBlue,
          'circle-opacity': 1,
          'circle-radius': circleRadius()
        }
      })

      map.addLayer({
        id: 'unfocus',
        type: 'circle',
        source: 'data',
        filter: ['!=', ['get', 'codeVoie'], codeVoie],
        paint: {
          'circle-color': getCircleColor(),
          'circle-stroke-width': 1,
          'circle-stroke-color': theme.colors.grey,
          'circle-opacity': 0.5,
          'circle-radius': circleRadius()
        }
      })
    } else {
      map.addLayer({
        id: 'focus',
        type: 'circle',
        source: 'data',
        paint: {
          'circle-color': getCircleColorFocus(),
          'circle-stroke-width': 1,
          'circle-stroke-color': theme.colors.darkBlue,
          'circle-radius': circleRadius()
        }
      })
    }

    map.addLayer({
      id: 'selected',
      type: 'circle',
      source: 'data',
      filter: ['any'],
      paint: {
        'circle-color': getCircleColorFocus(),
        'circle-radius': circleRadius()
      }
    })

    map.addLayer({
      id: 'numero-symbol',
      type: 'symbol',
      source: 'data',
      layout: {
        'text-field': '{numeroComplet}',
        'text-font': ['Roboto Regular'],
        'text-size': {
          stops: [
            [8, 1],
            [10, 2],
            [12, 4],
            [15, 10],
            [18, 16],
            [22, 20]
          ]
        },
        'text-anchor': 'center'
      },
      paint: {
        'text-color': codeVoie ? [
          'case',
          ['==', ['get', 'codeVoie'], codeVoie],
          '#fff',
          '#000'
        ] : '#fff'
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
    return (
      <div />
    )
  }
}

export default AddressesCommuneMap
