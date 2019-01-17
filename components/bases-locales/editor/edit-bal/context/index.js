import React from 'react'
import PropTypes from 'prop-types'
import {groupBy} from 'lodash'
import {randomColor} from 'randomcolor'

import {getNumerosByVoie, contoursToGeoJson} from '../../../../../lib/geojson'

import CommuneVisualizer from '../../../../commune-visualizer'

import CommuneContext from './commune/commune-context'
import VoieContext from './voie/voie-context'
import NumeroContext from './numero-context'

const getAddresses = commune => {
  const geojson = {
    type: 'FeatureCollection',
    features: []
  }

  Object.keys(commune.voies).forEach(voieIdx => {
    const voie = commune.voies[voieIdx]
    if (voie.numeros) {
      Object.keys(voie.numeros).forEach(numeroIdx => {
        const numero = commune.voies[voieIdx].numeros[numeroIdx]
        const positions = numero.edited ? numero.modified.positions : numero.positions

        if (positions.length > 0) {
          geojson.features.push({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: positions[0].coords
            },
            properties: {
              ...numero,
              codeCommune: commune.code,
              codeVoie: voie.codeVoie,
              nomVoie: voie.modified && voie.modified.nomVoie ? voie.modified.nomVoie : voie.nomVoie,
              source: positions[0].source,
              type: positions[0].type,
              lastUpdate: positions[0].dateMAJ,
              color: randomColor({
                seed: voie.codeVoie,
                luminosity: 'dark'
              })
            }
          })
        }
      })
    }
  })

  return geojson.features.length > 0 ? geojson : null
}

class Context extends React.Component {
  static propTypes = {
    commune: PropTypes.object.isRequired,
    actions: PropTypes.shape({
      addItem: PropTypes.func.isRequired
    }).isRequired,
    voie: PropTypes.object,
    numero: PropTypes.object
  }

  static defaultProps = {
    voie: null,
    numero: null
  }

  render() {
    const {commune, voie, numero, actions} = this.props
    const addresses = getAddresses(commune)
    const communeContour = commune.contour ? contoursToGeoJson([commune]) : null
    let CommuneMap

    if (addresses) {
      const groupedNumeros = groupBy(addresses.features, numero => numero.properties.codeVoie)

      CommuneMap = addresses ? () => (
        <CommuneVisualizer
          codeCommune={commune.code}
          voies={getNumerosByVoie(groupedNumeros)}
          numeros={addresses}
          voie={voie}
          select={actions.select}
        />
      ) : null
    }

    return (
      <div>
        {numero ? (
          <NumeroContext
            codeCommune={commune.code}
            voie={voie}
            numero={numero}
            bounds={addresses || communeContour}
            actions={actions}
          />
        ) : voie ? (
          <VoieContext
            commune={commune}
            voie={voie}
            addresses={addresses}
            addNumero={actions.addItem}
            actions={actions}
          >
            {addresses && <CommuneMap />}
          </VoieContext>
        ) : (
          <CommuneContext
            commune={commune}
            addresses={addresses}
            communeContour={communeContour}
            actions={actions}
          >
            {addresses && <CommuneMap />}
          </CommuneContext>
        )}
      </div>
    )
  }
}

export default Context
