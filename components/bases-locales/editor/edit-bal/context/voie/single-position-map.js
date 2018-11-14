import React from 'react'
import PropTypes from 'prop-types'
import computeBbox from '@turf/bbox'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import mapDrawStyle from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

import {pointOnCoords, numeroPointStyles} from '../../../../../../lib/mapbox-gl'

const createFeatureCollection = coords => {
  return {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      properties: {},
      geometry: pointOnCoords(coords)
    }]
  }
}

class PositionMap extends React.Component {
  static propTypes = {
    map: PropTypes.object.isRequired,
    bounds: PropTypes.object,
    coords: PropTypes.array,
    handlePosition: PropTypes.func.isRequired
  }

  static defaultProps = {
    bounds: null,
    coords: null
  }

  componentDidMount() {
    const {map} = this.props

    map.zoom(5)

    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        point: true,
        trash: true
      },
      styles: numeroPointStyles
    })

    map.on('load', this.onLoad)
    map.addControl(this.draw)

    map.on('styledata', this.styleData)

    map.on('draw.create', this.createPosition)
    map.on('draw.update', this.createPosition)
    map.on('draw.delete', () => this.props.handlePosition(null))

    this.fitBounds()
  }

  componentDidUpdate(prevProps) {
    const {coords} = this.props
    const {draw} = this

    if (coords && coords !== prevProps.coords) {
      draw.set(createFeatureCollection(coords))
    }
  }

  componentWillUnmount() {
    const {map} = this.props

    map.off('styledata', this.styleData)

    map.off('draw.create', this.createPosition)
    map.off('draw.delete', () => this.props.handlePosition(null))
  }

  fitBounds = () => {
    const {map, bounds, coords} = this.props
    const toCompute = bounds || createFeatureCollection(coords)
    const bbox = computeBbox(toCompute)

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
    const {draw} = this
    const {coords} = this.props

    const feature = {
      type: 'Feature',
      properties: {},
      geometry: pointOnCoords(coords)
    }

    draw.add(feature)
  }

  createPosition = event => {
    const {handlePosition} = this.props
    const currentFeature = event.features[0]

    handlePosition(currentFeature.geometry.coordinates)
  }

  render() {
    return (
      <div>
        <style
          dangerouslySetInnerHTML={{__html: mapDrawStyle}} // eslint-disable-line react/no-danger
        />
      </div>
    )
  }
}

export default PositionMap
