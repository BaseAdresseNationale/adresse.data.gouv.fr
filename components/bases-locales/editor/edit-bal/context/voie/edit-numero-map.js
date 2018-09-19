import React from 'react'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'
import mapStyle from 'mapbox-gl/dist/mapbox-gl.css'
import computeBbox from '@turf/bbox'

import theme from '../../../../../../styles/theme'

class EditNumeroMap extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    position: PropTypes.object,
    handlePosition: PropTypes.func.isRequired
  }

  static defaultProps = {
    position: null
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json'
    })

    this.map.on('load', this.onLoad)

    this.fitBounds()
  }

  componentDidUpdate(prevProps) {
    const {position} = this.props

    if (prevProps.position !== position) {
      const {map} = this

      if (position) {
        this.updateNewPosition()
      } else {
        map.removeLayer('new-point')
      }
    }
  }

  componentWillUnmount() {
    const {map} = this

    map.off('dragend', this.dragEnd)
  }

  fitBounds = () => {
    const {data, position} = this.props
    const geojson = {
      type: 'FeatureCollection',
      features: [data.features[0]]
    }

    if (position) {
      geojson.features.push(position.features[0])
    }

    const bbox = computeBbox(geojson)

    this.map.fitBounds(bbox, {
      padding: 30,
      linear: true,
      duration: 0,
      maxZoom: 18
    })
  }

  onLoad = () => {
    const {map} = this
    const {data} = this.props

    map.on('dragend', this.getCenter)
    map.on('zoomend', this.getCenter)

    map.addSource('original', {
      type: 'geojson',
      data
    })

    map.addLayer({
      id: 'original-point',
      source: 'original',
      type: 'circle',
      paint: {
        'circle-radius': 10,
        'circle-color': '#007cbf'
      }
    })

    this.updateNewPosition()
  }

  updateNewPosition = () => {
    const {map} = this
    const {position} = this.props
    const sourceId = 'new'
    const layerId = 'new-point'
    const source = map.getSource(sourceId)

    if (source) {
      source.setData(position)
    } else {
      map.addSource(sourceId, {
        type: 'geojson',
        data: position
      })
    }

    if (!map.getLayer(layerId)) {
      map.addLayer({
        id: layerId,
        source: 'new',
        type: 'circle',
        paint: {
          'circle-radius': 10,
          'circle-color': '#03BD5B'
        }
      })
    }
  }

  getCenter = () => {
    const {map} = this
    const {handlePosition} = this.props
    const center = map.getCenter()

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

export default EditNumeroMap
