import React from 'react'
import PropTypes from 'prop-types'
import {GeoJSONLayer} from 'react-mapbox-gl'

import ClusterLayers from './cluster-layers'
import MapboxGL from './index'

const lineLayout = {
  'line-cap': 'round',
  'line-join': 'round'
}

const linePaint = {
  'line-color': '#4790E5',
  'line-width': 2
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

const GeojsonMap = ({data, id, cluster, points}) => {
  const options = {
    cluster,
    clusterMaxZoom: 14,
    clusterRadius: 50,
    tolerance: 0.5,
    buffer: 60
  }

  return (
    <MapboxGL data={data}>
      <GeoJSONLayer
        id={id}
        sourceOptions={options}
        data={data}
        lineLayout={lineLayout}
        linePaint={linePaint}
        fillPaint={fillPaint}
        polygonPaint={polygonPaint}
        circlePaint={points ? {
          'circle-radius': 8,
          'circle-color': '#3099df',
          'circle-opacity': 1
        } : null}
        circleOnMouseDown={this.markerClick} />
      {cluster && <ClusterLayers sourceId={id} />}
    </MapboxGL>
  )
}

GeojsonMap.propTypes = {
  data: PropTypes.object.isRequired,
  id: PropTypes.string,
  cluster: PropTypes.bool,
  points: PropTypes.bool
}

GeojsonMap.defaultProps = {
  id: 'source_id',
  cluster: false,
  points: false
}

export default GeojsonMap
