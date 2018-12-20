import React from 'react'
import PropTypes from 'prop-types'
import computeBbox from '@turf/bbox'
import {uniqBy, orderBy} from 'lodash'
import computeDistance from '@turf/distance'

import theme from '../../../../../styles/theme'

const opacityByZoom = (start, end, asc = true) => {
  return [
    'interpolate',
    ['linear'],
    ['zoom'],
    start,
    asc ? 0 : 1,
    end,
    asc ? 1 : 0
  ]
}

function createPoint(coordinates) {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates
    }
  }
}

const getNearestVoie = (map, point, zoom, margin) => {
  let voie = null

  if (map.getZoom() >= zoom) {
    const bbox = [
      [point.x - margin, point.y - margin],
      [point.x + margin, point.y + margin]
    ]
    const features = uniqBy(map.queryRenderedFeatures(bbox, {layers: ['voies-concave']}), f => f.properties.id)

    if (features.length > 0) {
      const center = map.getCenter()
      const centerPoint = createPoint([center.lng, center.lat])

      const orderByDistance = orderBy(features, feature => {
        const coordinates = feature.properties.coordinates.slice(0, -1).substr(1).split(',').map(str => parseFloat(str))
        const point = createPoint(coordinates)
        const distance = computeDistance(centerPoint, point)

        return distance
      })

      voie = orderByDistance[0]
    }
  }

  return voie
}

class BalMap extends React.Component {
  static propTypes = {
    map: PropTypes.object.isRequired,
    voies: PropTypes.shape({
      features: PropTypes.array.isRequired
    }).isRequired,
    addresses: PropTypes.shape({
      features: PropTypes.array.isRequired
    }).isRequired,
    concaveVoie: PropTypes.shape({
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

    // Voies
    map.on('click', 'voies', this.onClick.bind(this))
    map.on('mouseenter', 'voies', this.onMouseEnter.bind(this))
    map.on('mouseleave', 'voies', this.onMouseLeave.bind(this))

    map.on('zoomend', this.zoomEnd.bind(this))
    map.on('dragend', this.dragEnd.bind(this))
  }

  componentDidUpdate() {
    const {map, selected} = this.props

    if (map.isStyleLoaded()) {
      if (selected) {
        map.setFilter('numeros', ['!=', ['get', 'codeVoie'], selected.id])
        map.setFilter('selected-numeros', ['==', ['get', 'codeVoie'], selected.id])
      } else {
        map.setFilter('numeros', ['all'])
        map.setFilter('selected-numeros', ['==', ['get', 'codeVoie'], 'empty'])
      }
    }
  }

  componentWillUnmount() {
    const {map} = this.props

    map.off('styledata', this.onStyleData)

    // Voies
    map.off('click', 'voies', this.onClick.bind(this))
    map.off('mouseenter', 'voies', this.onMouseEnter.bind(this))
    map.off('mouseleave', 'voies', this.onMouseLeave.bind(this))

    map.off('zoomend', this.zoomEnd.bind(this))
    map.off('dragend', this.dragEnd.bind(this))
  }

  fitBounds = forceBounds => {
    const {map, voies, addresses, bounds} = this.props
    const bbox = computeBbox(forceBounds || (bounds || voies || addresses))

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
      if (!map.getSource('voies') ||
      !map.getSource('addresses') ||
      !map.getSource('concave')) {
        this.onLoad()
      }
    } else {
      setTimeout(this.onStyleData, 1000)
    }
  }

  onLoad = () => {
    const {map, voies, addresses, concaveVoie} = this.props

    map.addSource('voies', {
      type: 'geojson',
      data: voies
    })

    map.addSource('concave', {
      type: 'geojson',
      data: concaveVoie
    })

    map.addSource('addresses', {
      type: 'geojson',
      data: addresses
    })

    map.addLayer({
      id: 'numeros',
      type: 'symbol',
      source: 'addresses',
      paint: {
        'text-color': '#fff',
        'text-halo-color': '#000',
        'text-halo-width': 1,
        'text-opacity': opacityByZoom(15, 18)
      },
      layout: {
        'text-font': ['Roboto Regular'],
        'text-field': '{numero}'
      }
    })

    map.addLayer({
      id: 'selected-numeros',
      type: 'symbol',
      source: 'addresses',
      paint: {
        'text-color': '#fff',
        'text-halo-color': theme.primaryDark,
        'text-halo-width': 2,
        'text-opacity': opacityByZoom(15, 18)
      },
      layout: {
        'text-font': ['Roboto Regular'],
        'text-field': '{numero}'
      }
    })

    map.addLayer({
      id: 'voies-concave',
      type: 'fill',
      source: 'concave',
      paint: {
        'fill-opacity': 0,
        'fill-color': theme.primary
      }
    })

    map.addLayer({
      id: 'voies',
      type: 'symbol',
      source: 'voies',
      paint: {
        'text-color': '#000',
        'text-halo-color': '#FFF',
        'text-halo-width': 1,
        'text-opacity': opacityByZoom(15, 18, false)
      },
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
        'text-font': ['Roboto Regular']
      }
    })
  }

  zoomEnd = e => {
    const {map, select} = this.props

    if (e.originalEvent) {
      const points = {
        x: e.originalEvent.x,
        y: e.originalEvent.y
      }

      const voie = getNearestVoie(map, points, 14, 400)

      select(voie)
    }
  }

  dragEnd = e => {
    const {map, select} = this.props

    const points = {
      x: e.originalEvent.x,
      y: e.originalEvent.y
    }

    const voie = getNearestVoie(map, points, 14, 400)

    select(voie)
  }

  onMouseEnter = () => {
    const {map} = this.props
    map.getCanvas().style.cursor = 'pointer'
  }

  onMouseLeave = () => {
    const {map} = this.props
    map.getCanvas().style.cursor = ''
  }

  onClick = event => {
    const {map, select} = this.props
    const voie = event.features[0]

    map.flyTo({center: voie.geometry.coordinates, zoom: 18})
    select(voie)
  }

  render() {
    return (
      <div>
        <div className='map-center centered' />

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

export default BalMap
