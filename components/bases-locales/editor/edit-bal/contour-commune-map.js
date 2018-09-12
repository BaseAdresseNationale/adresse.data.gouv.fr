import React from 'react'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'
import mapStyle from 'mapbox-gl/dist/mapbox-gl.css'
import computeBbox from '@turf/bbox'

class ContourCommuneMap extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      features: PropTypes.array.isRequired
    }).isRequired,
    select: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.handlers = []

    for (const layer of ['polygon-fill', 'line']) {
      this.handlers.push({
        event: 'mousemove',
        layer,
        handler: this.onMouseMove.bind(this, layer)
      }, {
        event: 'mouseleave',
        layer,
        handler: this.onMouseLeave.bind(this, layer)
      },
      {
        event: 'click',
        layer,
        handler: this.onClick.bind(this, layer)
      })
    }
  }

  componentDidMount() {
    const {data} = this.props
    const bbox = computeBbox(data)

    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json'
    })

    this.map.once('load', this.onLoad)

    this.map.fitBounds(bbox, {
      padding: 30,
      linear: true,
      duration: 0
    })

    for (const {event, layer, handler} of this.handlers) {
      this.map.on(event, layer, handler)
    }
  }

  componentWillUnmount() {
    const {map} = this

    for (const {event, layer, handler} of this.handlers) {
      map.off(event, layer, handler)
    }
  }

  onLoad = () => {
    const {map} = this
    const {data} = this.props

    map.addSource('data', {
      type: 'geojson',
      data
    })

    map.addLayer({
      id: 'polygon-fill',
      type: 'fill',
      source: 'data',
      paint: {
        'fill-color': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          '#2c3e50',
          '#3099df'
        ],
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          0.5,
          0.3
        ]
      },
      filter: ['==', '$type', 'Polygon']
    })

    map.addLayer({
      id: 'line',
      type: 'line',
      source: 'data',
      paint: {
        'line-color': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          '#2c3e50',
          '#3099df'
        ],
        'line-width': 5,
        'line-opacity': 0.8
      },
      filter: ['==', '$type', 'LineString']
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
    const {select} = this.props
    const [feature] = event.features

    select(feature.id)
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
            height: 100%;
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

export default ContourCommuneMap
