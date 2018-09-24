import React from 'react'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'
import mapStyle from 'mapbox-gl/dist/mapbox-gl.css'
import computeBbox from '@turf/bbox'

import theme from '../../../../../../styles/theme'

import {pointOnPos, pointOnCoords} from '../../../../../../lib/mapbox-gl'

class CreateNumeroMap extends React.Component {
  static propTypes = {
    position: PropTypes.object,
    handlePosition: PropTypes.func.isRequired
  }

  static defaultProps = {
    position: null
  }

  componentDidMount() {
    const {position} = this.props

    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json',
      center: [1.7191, 46.7111],
      zoom: 5
    })

    this.map.on('load', this.onLoad)

    if (position) {
      this.fitBounds()
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.position !== this.props.position) {
      const source = this.map.getSource('point')
      source.setData(pointOnCoords(this.position))

      if (this.props.position) {
        this.fitBounds()
      }
    }
  }

  componentWillUnmount() {
    const {map} = this

    map.off('dragend', this.dragEnd)
  }

  fitBounds = () => {
    const {position} = this.props
    const bbox = computeBbox(pointOnCoords(position))

    this.map.fitBounds(bbox, {
      padding: 30,
      linear: true,
      duration: 0
    })
  }

  onLoad = () => {
    const {map} = this
    const {position} = this.props

    map.on('dragend', this.getCenter)
    map.on('zoomend', this.getCenter)

    map.addSource('point', {
      type: 'geojson',
      data: pointOnCoords(position)
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

  getCenter = () => {
    const {map} = this
    const {handlePosition} = this.props
    const center = map.getCenter()
    const point = map.getSource('point')

    point.setData(pointOnPos(center))

    handlePosition(center)
  }

  render() {
    return (
      <div className='container'>
        <div ref={el => {
          this.mapContainer = el
        }} className='container' />

        <div className='map-center' />

        <style
          dangerouslySetInnerHTML={{__html: mapStyle}} // eslint-disable-line react/no-danger
        />
        <style jsx>{`
          .container {
            position: relative;
            height: 400px;
            width: 100%;
          }

          .map-center {
            position: absolute;
            pointer-events: none;
            top: calc(50% - 30px);
            left: calc(50% - 30px);
            color: white;
            width: 60px;
            height: 60px;
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
            height: 1px;
            width: 100%;
          }
        `}</style>
      </div>
    )
  }
}

export default CreateNumeroMap
