import React from 'react'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'
import mapStyle from 'mapbox-gl/dist/mapbox-gl.css'
import computeBbox from '@turf/bbox'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import mapDrawStyle from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

import {pointOnCoords, numeroPointStyles} from '../../../../../../lib/mapbox-gl'

class EditNumeroMap extends React.Component {
  static propTypes = {
    position: PropTypes.array.isRequired,
    handlePosition: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json'
    })

    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      styles: numeroPointStyles
    })

    this.map.on('load', this.onLoad)
    this.map.addControl(this.draw)

    this.map.on('draw.update', this.move)
  }

  componentDidUpdate(prevProps) {
    const {position} = this.props
    const {draw} = this

    if (prevProps.position !== position) {
      draw.set({
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          properties: {},
          geometry: pointOnCoords(position)
        }]
      })

      this.fitBounds()
    }
  }

  componentWillUnmount() {
    const {map} = this

    map.off('draw.update', this.move)
  }

  fitBounds = () => {
    const {draw} = this
    const geojson = draw.getAll()
    const bbox = computeBbox(geojson)

    this.map.fitBounds(bbox, {
      padding: 30,
      linear: true,
      duration: 0,
      maxZoom: 16
    })
  }

  onLoad = () => {
    const {draw} = this
    const {position} = this.props

    const feature = {
      type: 'Feature',
      properties: {},
      geometry: pointOnCoords(position)
    }

    draw.add(feature)
    this.fitBounds()
  }

  move = event => {
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

export default EditNumeroMap
