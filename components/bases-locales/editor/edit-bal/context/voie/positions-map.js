import React from 'react'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'
import mapStyle from 'mapbox-gl/dist/mapbox-gl.css'
import computeBbox from '@turf/bbox'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import mapDrawStyle from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

import theme from '../../../../../../styles/theme'

import {positionsToGeoJson} from '../../../../../../lib/geojson'
import {numeroIconStyles} from '../../../../../../lib/mapbox-gl'

import SelectPositionType from './select-position-type'

class PositionsMap extends React.Component {
  state = {
    selectedPosition: null
  }

  static propTypes = {
    bounds: PropTypes.object,
    positions: PropTypes.array,
    addPosition: PropTypes.func.isRequired,
    removePosition: PropTypes.func.isRequired,
    updatePosition: PropTypes.func.isRequired
  }

  static defaultProps = {
    bounds: null,
    positions: null
  }

  componentDidMount() {
    const {bounds, positions} = this.props

    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json',
      center: [1.7191, 46.7111],
      zoom: 5
    })

    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      userProperties: true,
      controls: {
        point: true,
        trash: true
      },
      styles: numeroIconStyles
    })

    this.map.on('load', this.onLoad)
    this.map.addControl(this.draw)

    this.map.on('draw.create', this.create)
    this.map.on('draw.update', this.update)
    this.map.on('draw.delete', this.remove)
    this.map.on('draw.selectionchange', this.selectionChange)

    if (bounds || positions.length > 0) {
      this.fitBounds()
    }
  }

  componentDidUpdate(prevProps) {
    const {positions} = this.props
    const {draw} = this

    if (positions !== prevProps.positions) {
      if (positions.length === 0) {
        draw.deleteAll()
      } else {
        const features = positionsToGeoJson(positions)
        draw.set(features)
      }
    }
  }

  componentWillUnmount() {
    const {map} = this

    map.off('load', this.onLoad)

    map.off('draw.create', this.create)
    map.off('draw.click', this.test)
    map.off('draw.update', this.update)
    map.off('draw.delete', this.remove)
    map.off('draw.selectionchange', this.selectionChange)
  }

  fitBounds = () => {
    const {bounds, positions} = this.props
    const toCompute = (positions.length > 0 ? positionsToGeoJson(positions) : null) || bounds
    const bbox = computeBbox(toCompute)

    this.map.fitBounds(bbox, {
      padding: 30,
      linear: true,
      maxZoom: 16,
      duration: 0
    })
  }

  onLoad = () => {
    const {draw} = this
    const {positions} = this.props

    if (positions.length > 0) {
      draw.add(positionsToGeoJson(positions))
    }
  }

  create = event => {
    const {addPosition} = this.props
    const currentFeature = event.features[0]

    this.setState({selectedPosition: currentFeature})

    addPosition(currentFeature)
  }

  update = event => {
    const {updatePosition} = this.props
    const currentFeature = event.features[0]

    updatePosition(currentFeature)
  }

  remove = event => {
    const {removePosition} = this.props
    const currentFeature = event.features[0]

    this.setState({selectedPosition: null})
    removePosition(currentFeature)
  }

  setType = type => {
    const {draw} = this
    const {selectedPosition} = this.state
    const {updatePosition} = this.props
    const position = draw.get(selectedPosition.id)

    position.properties.type = type
    updatePosition(position)

    this.setState({selectedPosition: null})
  }

  selectionChange = () => {
    const {draw} = this
    const selected = draw.getSelected()
    const feature = selected.features.length > 0 ? selected.features[0] : null

    if (feature) {
      this.setState({selectedPosition: feature})
    } else {
      this.setState({selectedPosition: null})
    }
  }

  render() {
    const {selectedPosition} = this.state

    return (
      <div className='container'>
        <div ref={el => {
          this.mapContainer = el
        }} className='container' />

        {selectedPosition && (
          <div className='select-type'>
            <SelectPositionType
              type={selectedPosition.properties.type}
              onSubmit={this.setType}
            />
          </div>
        )}

        <style
          dangerouslySetInnerHTML={{__html: mapStyle + mapDrawStyle}} // eslint-disable-line react/no-danger
        />
        <style jsx>{`
          .container {
            position: relative;
            height: 400px;
            width: 100%;
          }

          .select-type {
            position: absolute;
            top: calc(75% - 40px);
            left: calc(50% - 100px);
            padding: 1em;
            background: #fff;
            box-shadow: 0 1px 4px 0 ${theme.boxShadow};
          }

          .select-type > div {
            width: 200px;
            height: 75px;
          }
        `}</style>
      </div>
    )
  }
}

export default PositionsMap
