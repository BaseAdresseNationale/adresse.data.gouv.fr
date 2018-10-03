import React from 'react'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'
import mapStyle from 'mapbox-gl/dist/mapbox-gl.css'
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

class AdressesCommuneMap extends React.Component {
  static propTypes = {
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
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json'
    })

    this.map.once('load', this.onLoad)
    this.fitBounds()

    this.map.on('mousemove', 'focus', this.onMouseMove.bind(this, 'focus'))
    this.map.on('mouseleave', 'focus', this.onMouseLeave.bind(this, 'focus'))
    this.map.on('click', 'focus', this.onClick.bind(this, 'focus'))

    this.map.on('mousemove', 'unfocus', this.onMouseMove.bind(this, 'unfocus'))
    this.map.on('mouseleave', 'unfocus', this.onMouseLeave.bind(this, 'unfocus'))
    this.map.on('click', 'unfocus', this.onClick.bind(this, 'unfocus'))
  }

  componentDidUpdate(prevProps) {
    const {map} = this
    const {data, selected} = this.props

    if (data !== prevProps.data) {
      const source = this.map.getSource('data')

      source.setData(data)
    }

    if (!selected) {
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
    const {map} = this

    map.off('mousemove', 'focus', this.onMouseMove.bind(this, 'focus'))
    map.off('mouseleave', 'focus', this.onMouseLeave.bind(this, 'focus'))
    map.off('click', 'focus', this.onClick.bind(this, 'focus'))

    map.off('mousemove', 'unfocus', this.onMouseMove.bind(this, 'unfocus'))
    map.off('mouseleave', 'unfocus', this.onMouseLeave.bind(this, 'unfocus'))
    map.off('click', 'unfocus', this.onClick.bind(this, 'unfocus'))
  }

  fitBounds = () => {
    const {data, bounds} = this.props
    const bbox = computeBbox(bounds || data)

    this.map.fitBounds(bbox, {
      padding: 30,
      linear: true,
      maxZoom: 16,
      duration: 0
    })
  }

  onLoad = () => {
    const {map} = this
    const {data, codeVoie} = this.props

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
    const {map} = this
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
    const {map} = this
    const canvas = map.getCanvas()
    canvas.style.cursor = ''

    if (this.highlighted) {
      map.setFeatureState({source: 'data', id: this.highlighted}, {hover: false})
    }
  }

  onClick = (layer, event) => {
    const {map} = this
    const {select} = this.props
    const [feature] = event.features
    const {codeCommune, codeVoie, numeroComplet} = feature.properties

    map.setCenter(event.lngLat)
    map.setZoom(16)

    select(codeCommune, codeVoie, numeroComplet)
  }

  render() {
    return (
      <div className='container'>
        <div ref={el => {
          this.mapContainer = el
        }} className='container' />

        <style
          dangerouslySetInnerHTML={{__html: mapStyle}} // eslint-disable-line react/no-danger
        />
        <style jsx>{`
          .container {
            position: relative;
            height: 600px;
            margin: 1em 0;
            width: 100%;
          }

          .info {
            position: absolute;
            pointer-events: none;
            top: 10px;
            left: 10px;
            max-width: 40%;
            overflow: hidden;
          }
        `}</style>
      </div>
    )
  }
}

export default AdressesCommuneMap
