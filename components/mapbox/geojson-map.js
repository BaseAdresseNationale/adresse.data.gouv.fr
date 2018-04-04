import React from 'react'
import PropTypes from 'prop-types'
import {GeoJSONLayer} from 'react-mapbox-gl'
import {center, bbox} from '@turf/turf'

import ClusterLayers from './cluster-layers'
import Mapbox from './index'

const lineLayout = {
  'line-cap': 'round',
  'line-join': 'round'
}

const linePaint = {
  'line-color': '#4790E5',
  'line-width': 4
}

const fillPaint = {
  'fill-color': '#3099df',
  'fill-opacity': 0.2
}

const polygonPaint = {
  'fill-color': '#3099df',
  'fill-outline-color': 'blue',
  'fill-opacity': 0.3
}

class Layers extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      bounds: null,
      boundsCenter: null
    }

    this.getCirclePaint = this.getCirclePaint.bind(this)
  }

  componentWillMount() {
    const {data} = this.props
    const extent = bbox(data)
    const boundsCenter = center(data).geometry.coordinates

    this.setState({
      bounds: [
        extent.splice(0, 2),
        extent.splice(0, 2)
      ],
      boundsCenter
    })
  }

  getCirclePaint() {
    return {
      'circle-radius': 1,
      'circle-color': '#3099df',
      'circle-opacity': 0.6
    }
  }

  render() {
    const {bounds, boundsCenter} = this.state
    const {data, id, cluster} = this.props
    const options = {
      cluster,
      clusterMaxZoom: 14,
      clusterRadius: 50,
      tolerance: 0.5,
      buffer: 60
    }

    return (
      <Mapbox center={boundsCenter} bounds={bounds}>
        <GeoJSONLayer
          id={id}
          sourceOptions={options}
          data={data}
          lineLayout={lineLayout}
          linePaint={linePaint}
          fillPaint={fillPaint}
          polygonPaint={polygonPaint}
          circlePaint={this.getCirclePaint()}
          circleOnMouseDown={this.markerClick} />
        {cluster && <ClusterLayers sourceId={id} />}
      </Mapbox>
    )
  }
}

Layers.propTypes = {
  data: PropTypes.object.isRequired,
  id: PropTypes.string,
  cluster: PropTypes.bool
}

Layers.defaultProps = {
  id: 'source_id',
  cluster: false
}

export default Layers
