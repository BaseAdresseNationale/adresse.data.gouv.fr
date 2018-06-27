import React from 'react'
import PropTypes from 'prop-types'
import {Source, Layer} from 'react-mapbox-gl'

import {numerosToGeoJson} from '../../../../../../lib/geojson'

import theme from '../../../../../../styles/theme'

import MapboxGL from '../../../../../mapbox-gl'
import Notification from '../../../../../notification'

const circlePaint = {
  'circle-stroke-width': 1,
  'circle-stroke-color': '#DDD',
  'circle-radius': {
    base: 1.6,
    stops: [[12, 3], [22, 120]]
  },
  'circle-color': theme.colors.white,
  'circle-opacity': 0.8
}

class NumerosMap extends React.Component {
  render() {
    const {numeros} = this.props
    const data = numerosToGeoJson(numeros)

    if (data.features.length === 0) {
      return <Notification type='error' message='No position' />
    }

    return (
      <MapboxGL data={data}>
        <Source id='numeros-map' geoJsonSource={{
          type: 'geojson',
          data
        }} />

        <Layer
          id='point'
          sourceId='numeros-map'
          type='circle'
          paint={circlePaint} />

        <Layer
          id='point-label'
          type='symbol'
          sourceId='numeros-map'
          layout={{
            'text-field': '{numero}',
            'text-anchor': 'center',
            'text-size': {
              stops: [[12, 3], [22, 18]]
            },
            'text-font': [
              'Noto Sans Regular'
            ]
          }} />
      </MapboxGL>
    )
  }
}

NumerosMap.propTypes = {
  numeros: PropTypes.array.isRequired
}

export default NumerosMap
