import React from 'react'
import PropTypes from 'prop-types'
import computeCentroid from '@turf/centroid'
import {compact, groupBy} from 'lodash'

import Mapbox from '../../../../mapbox'

import BalMap from './bal-map'

const createCentroid = features => {
  const points = {
    type: 'FeatureCollection',
    features
  }

  return computeCentroid(points)
}

class MapMode extends React.Component {
  static propTypes = {
    addresses: PropTypes.object
  }

  static defaultProps = {
    addresses: null
  }

  render() {
    const {addresses} = this.props

    const voies = groupBy(addresses.features, feature => feature.properties.codeVoie)
    const numerosByVoie = Object.keys(voies).map(voie => {
      let result = null
      const numeroFeatures = voies[voie].map(numero => numero)

      if (numeroFeatures.length >= 2) {
        result = createCentroid(numeroFeatures)
      } else {
        result = numeroFeatures[0]
      }

      if (result) {
        result.properties = {
          id: voie,
          numerosCount: String(numeroFeatures.length),
          voieName: numeroFeatures[0].properties.nomVoie
        }
      }

      return result
    })

    return (
      <Mapbox>
        {map => (
          <BalMap
            map={map}
            voies={{
              type: 'FeatureCollection',
              features: compact(numerosByVoie)
            }}
            addresses={addresses}
          />
        )}
      </Mapbox>
    )
  }
}

export default MapMode
