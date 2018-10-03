import React from 'react'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'
import mapStyle from 'mapbox-gl/dist/mapbox-gl.css'
import computeBbox from '@turf/bbox'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import mapDrawStyle from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

import theme from '../../../../../../styles/theme'

import {pointOnCoords, numeroPointStyles} from '../../../../../../lib/mapbox-gl'

class CreateNumeroMap extends React.Component {
  static propTypes = {
    bounds: PropTypes.object,
    position: PropTypes.array,
    handlePosition: PropTypes.func.isRequired,
    children: PropTypes.node
  }

  static defaultProps = {
    bounds: null,
    position: null,
    children: null
  }

  componentDidMount() {
    const {bounds} = this.props

    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json',
      center: [1.7191, 46.7111],
      zoom: 5
    })

    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        point: true,
        trash: true
      },
      styles: numeroPointStyles
    })

    this.map.on('load', this.onLoad)
    this.map.addControl(this.draw)

    this.map.on('draw.create', this.createPosition)
    this.map.on('draw.update', this.createPosition)
    this.map.on('draw.delete', () => this.props.handlePosition(null))

    if (bounds) {
      this.fitBounds()
    }
  }

  componentDidUpdate(prevProps) {
    const {position} = this.props
    const {draw} = this

    if (prevProps.position !== position && position) {
      if (position) {
        draw.set({
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: pointOnCoords(position)
          }]
        })
      }
    }
  }

  componentWillUnmount() {
    const {map} = this

    map.off('draw.create', this.createPosition)
    map.off('draw.delete', () => this.props.handlePosition(null))
  }

  fitBounds = () => {
    const {bounds} = this.props
    const bbox = computeBbox(bounds)

    this.map.fitBounds(bbox, {
      padding: 30,
      linear: true,
      maxZoom: 16,
      duration: 0
    })
  }

  onLoad = () => {
    const {map} = this
    const {bounds} = this.props

    map.addSource('point', {
      type: 'geojson',
      data: pointOnCoords(bounds)
    })

    map.addLayer({
      id: 'point-layer',
      source: 'point',
      type: 'circle',
      paint: {
        'circle-radius': 10,
        'circle-color': '#007cbf'
      }
    })
  }

  createPosition = event => {
    const {handlePosition} = this.props
    const currentFeature = event.features[0]

    handlePosition(currentFeature.geometry.coordinates)
  }

  render() {
    const {children} = this.props

    return (
      <div className='container'>
        <div ref={el => {
          this.mapContainer = el
        }} className='container' />

        <style
          dangerouslySetInnerHTML={{__html: mapStyle + mapDrawStyle}} // eslint-disable-line react/no-danger
        />

        {children && (
          <div className='form'>
            {children}
          </div>
        )}

        <style jsx>{`
          .container {
            position: relative;
            height: 400px;
            width: 100%;
          }

          .form {
            width: 320px;
            height: 300px;
            padding: 1em;
            position: absolute;
            left: calc(50% - 160px);
            top: calc(50% - 150px);
            background-color: #ffffffc4;
            box-shadow: 0 1px 4px 0 ${theme.boxShadow};
          }
        `}</style>
      </div>
    )
  }
}

export default CreateNumeroMap
