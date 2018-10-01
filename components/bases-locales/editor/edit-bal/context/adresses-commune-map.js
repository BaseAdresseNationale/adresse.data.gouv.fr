import React from 'react'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'
import mapStyle from 'mapbox-gl/dist/mapbox-gl.css'
import computeBbox from '@turf/bbox'

import theme from '../../../../../styles/theme'

const circleColor = [
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

class AdressesCommuneMap extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
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
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json'
    })

    this.map.once('load', this.onLoad)
    this.fitBounds()

    this.map.on('mousemove', 'circle', this.onMouseMove.bind(this, 'circle'))
    this.map.on('mouseleave', 'circle', this.onMouseLeave.bind(this, 'circle'))
    this.map.on('click', 'circle', this.onClick.bind(this, 'circle'))
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

    map.off('mousemove', 'circle', this.onMouseMove.bind(this, 'circle'))
    map.off('mouseleave', 'circle', this.onMouseLeave.bind(this, 'circle'))
    map.off('click', 'circle', this.onClick.bind(this, 'circle'))
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
    const {data} = this.props

    map.addSource('data', {
      type: 'geojson',
      generateId: true,
      data
    })

    map.addLayer({
      id: 'circle',
      type: 'circle',
      source: 'data',
      paint: {
        'circle-color': circleColor,
        'circle-radius': {
          'base': 1.75,
          'stops': [[12, 2], [22, 150]]
        }
      }
    })

    map.addLayer({
      id: 'selected',
      type: 'circle',
      source: 'data',
      filter: ['any'],
      paint: {
        'circle-color': circleColor,
        'circle-radius': {
          'base': 1.75,
          'stops': [[12, 4], [22, 200]]
        }
      }
    })

    map.addLayer({
      id: 'numero-symbol',
      type: 'symbol',
      source: 'data',
      layout: {
        'text-field': '{numeroComplet}',
        'text-size': {
          'base': 1.75,
          'stops': [[12, 2], [22, 150]]
        },
        'text-anchor': 'center'
      },
      paint: {
        'text-color': '#fff'
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
