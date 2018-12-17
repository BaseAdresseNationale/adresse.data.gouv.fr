import React from 'react'
import PropTypes from 'prop-types'
import computeBbox from '@turf/bbox'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import mapDrawStyle from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

import {positionsToGeoJson} from '../../../../../../lib/geojson'
import {numeroIconStyles} from '../../../../../../lib/mapbox-gl'

import SelectPositionType from './select-position-type'

class PositionsMap extends React.Component {
  state = {
    selectedPosition: null
  }

  static propTypes = {
    map: PropTypes.object.isRequired,
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
    const {map, bounds, positions} = this.props

    map.setZoom(5)

    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      userProperties: true,
      controls: {
        point: true,
        trash: true
      },
      styles: numeroIconStyles
    })

    map.on('load', this.onLoad)
    map.addControl(this.draw)

    map.on('styledata', this.onStyleData)

    map.on('draw.create', this.create)
    map.on('draw.update', this.update)
    map.on('draw.delete', this.remove)
    map.on('draw.selectionchange', this.selectionChange)

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
    const {map} = this.props

    map.off('load', this.onLoad)

    map.off('styledata', this.onStyleData)

    map.off('draw.create', this.create)
    map.off('draw.update', this.update)
    map.off('draw.delete', this.remove)
    map.off('draw.selectionchange', this.selectionChange)
  }

  fitBounds = () => {
    const {map, bounds, positions} = this.props
    const toCompute = (positions.length > 0 ? positionsToGeoJson(positions) : null) || bounds
    const bbox = computeBbox(toCompute)

    map.fitBounds(bbox, {
      padding: 30,
      linear: true,
      maxZoom: 16,
      duration: 0
    })
  }

  onStyleData = () => {
    const {map} = this.props

    if (map.isStyleLoaded()) {
      if (!map.getSource('data')) {
        this.onLoad()
      }
    } else {
      setTimeout(this.onStyleData, 1000)
    }
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
    const {selectedPosition} = this.state
    const {removePosition} = this.props
    const currentFeature = event.features ? event.features[0] : selectedPosition

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
      <div>
        {selectedPosition && (
          <div className='select-type'>
            <h3>Position sélectionnée</h3>
            <SelectPositionType
              type={selectedPosition.properties.type}
              onSubmit={this.setType}
              remove={this.remove}
            />
          </div>
        )}

        <style
          dangerouslySetInnerHTML={{__html: mapDrawStyle}} // eslint-disable-line react/no-danger
        />

        <style jsx>{`
          .select-type {
            padding: 0 1em;
          }
        `}</style>
      </div>
    )
  }
}

export default PositionsMap
