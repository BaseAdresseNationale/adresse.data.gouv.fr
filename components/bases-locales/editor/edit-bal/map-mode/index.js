import React from 'react'
import PropTypes from 'prop-types'
import computeCentroid from '@turf/centroid'
import computeConcave from '@turf/concave'
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

const createConcave = features => {
  const points = {
    type: 'FeatureCollection',
    features
  }

  return computeConcave(points)
}

const getNumerosByVoie = voies => {
  const numerosVoies = Object.keys(voies).map(voie => {
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
        coordinates: result.geometry.coordinates,
        numerosCount: String(numeroFeatures.length),
        voieName: numeroFeatures[0].properties.nomVoie
      }
    }

    return result
  })

  return {
    type: 'FeatureCollection',
    features: compact(numerosVoies)
  }
}

const getConcaveVoie = voies => {
  const numerosVoies = Object.keys(voies).map(voie => {
    let result = null
    const numeroFeatures = voies[voie].map(numero => numero)

    if (numeroFeatures.length >= 3) {
      result = createConcave(numeroFeatures)
    }

    if (result) {
      result.properties = {
        id: voie,
        coordinates: createCentroid(numeroFeatures).geometry.coordinates,
        numerosCount: String(numeroFeatures.length),
        codeCommune: numeroFeatures[0].properties.codeCommune,
        codeVoie: numeroFeatures[0].properties.codeVoie,
        voieName: numeroFeatures[0].properties.nomVoie
      }
    }

    return result
  })

  return {
    type: 'FeatureCollection',
    features: compact(numerosVoies)
  }
}

class MapMode extends React.Component {
  state = {
    voieFocused: null
  }

  static propTypes = {
    addresses: PropTypes.object,
    actions: PropTypes.object.isRequired
  }

  static defaultProps = {
    addresses: null
  }

  select = (voie, t = false) => {
    const {mode} = this.state
    const {actions} = this.props

    if (t && voie) {
      actions.select(voie.properties.codeCommune, voie.properties.codeVoie, null, false)
      this.setState({voieFocused: voie ? voie.properties : null})
    } else {
      if (!mode) {
        this.setState({voieFocused: voie ? voie.properties : null})
      }

      if (mode === 'delete') {
        actions.deleteItem(voie)
      }
    }
  }

  handleMode = mode => {
    this.setState({mode})
  }

  render() {
    const {voieFocused, mode} = this.state
    const {addresses} = this.props

    const voies = groupBy(addresses.features, feature => feature.properties.codeVoie)
    const numerosByVoie = getNumerosByVoie(voies)
    const concaveVoie = getConcaveVoie(voies)

    return (
      <div>
        <div className='head'>
          <h1>{voieFocused ? voieFocused.voieName : ''}</h1>
        </div>
        <Mapbox switchStyle>
          {map => (
            <BalMap
              map={map}
              voies={numerosByVoie}
              concaveVoie={concaveVoie}
              addresses={addresses}
              selected={voieFocused}
              select={this.select}
              mode={mode}
              changeMode={this.handleMode}
            />
          )}
        </Mapbox>

        <style jsx>{`
          .head {
            min-height: 35px;
          }
        `}</style>
      </div>
    )
  }
}

export default MapMode
