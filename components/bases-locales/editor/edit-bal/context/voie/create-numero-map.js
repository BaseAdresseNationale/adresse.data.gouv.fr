import React from 'react'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'
import mapStyle from 'mapbox-gl/dist/mapbox-gl.css'
import computeBbox from '@turf/bbox'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import mapDrawStyle from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

import {pointOnCoords, numeroPointStyles} from '../../../../../../lib/mapbox-gl'

class CreateNumeroMap extends React.Component {
  static propTypes = {
    contour: PropTypes.object,
    position: PropTypes.array,
    handlePosition: PropTypes.func.isRequired
  }

  static defaultProps = {
    contour: null,
    position: null
  }

  componentDidMount() {
    const {contour} = this.props

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

    if (contour) {
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
    const {contour} = this.props
    const bbox = computeBbox(contour)

    this.map.fitBounds(bbox, {
      padding: 30,
      linear: true,
      duration: 0
    })
  }

  onLoad = () => {
    const {map} = this
    const {contour} = this.props

    map.addSource('point', {
      type: 'geojson',
      data: pointOnCoords(contour)
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
    return (
      <div className='container'>
        <div ref={el => {
          this.mapContainer = el
        }} className='container' />

        <style
          dangerouslySetInnerHTML={{__html: mapStyle + mapDrawStyle}} // eslint-disable-line react/no-danger
        />
        <style jsx>{`
          .container {
            position: relative;
            height: 400px;
            width: 100%;
          }
        `}</style>
      </div>
    )
  }
}

export default CreateNumeroMap
