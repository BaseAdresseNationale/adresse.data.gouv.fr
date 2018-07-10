import React from 'react'
import PropTypes from 'prop-types'
import {Source, Layer} from 'react-mapbox-gl'

import {numerosToGeoJson} from '../../../../../../lib/geojson'

import theme from '../../../../../../styles/theme'

import MapboxGL from '../../../../../mapbox-gl'

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
  static propTypes = {
    numeros: PropTypes.array,
    position: PropTypes.object
  }

  render() {
    const {numeros, position} = this.props
    const data = numeros ? numerosToGeoJson(numeros) : {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: position.coords
      },
      properties: {
        source: position.source,
        type: position.type,
        dateMAJ: position.dateMAJ
      }
    }

    return (
      <MapboxGL data={data} fitBoundsMaxZoom={18}>
        <Source id='numeros-map' geoJsonSource={{
          type: 'geojson',
          data
        }} />

        <Layer
          id='point'
          sourceId='numeros-map'
          type='circle'
          paint={circlePaint} />

        {numeros &&
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
            }} />}
      </MapboxGL>
    )
  }
}

export default NumerosMap
