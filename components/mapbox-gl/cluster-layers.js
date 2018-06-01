import {Fragment} from 'react'
import PropTypes from 'prop-types'
import {Layer} from 'react-mapbox-gl'

const ClusterLayers = ({sourceId}) => (
  <Fragment>
    <Layer
      id='cluster_layer'
      sourceId={sourceId}
      layerOptions={{
        filter: [
          'has', 'point_count'
        ]
      }}
      paint={{
        'circle-color': [
          'step',
          ['get', 'point_count'],
          '#B4E1FA',
          100,
          '#1E90DA',
          750,
          '#006CB0'
        ],
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          20,
          100,
          30,
          750,
          40
        ]
      }}
      type='circle' />

    <Layer
      id='unclustered_layer'
      sourceId={sourceId}
      layerOptions={{
        filter: [
          '!has', 'point_count'
        ]
      }}
      paint={{
        'circle-color': 'green',
        'circle-radius': 10
      }}
      type='circle' />

    <Layer
      id='cluster-count'
      sourceId={sourceId}
      layerOptions={{
        filter: [
          'has', 'point_count'
        ]
      }}
      layout={{
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12
      }}
      paint={{
        'text-color': '#fff'
      }}
      type='symbol' />
  </Fragment>
)

ClusterLayers.propTypes = {
  sourceId: PropTypes.string.isRequired
}

export default ClusterLayers
