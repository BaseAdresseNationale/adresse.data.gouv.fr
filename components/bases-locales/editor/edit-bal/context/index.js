import React from 'react'
import PropTypes from 'prop-types'

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
              source: positions[0].source,
              type: positions[0].type,
              lastUpdate: positions[0].dateMAJ
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
    const communeContour = commune.contour ? {
      id: commune.code,
      type: 'Feature',
      geometry: {
        type: commune.contour.type,
        coordinates: commune.contour.coordinates
      },
      properties: {
        code: commune.code,
        nom: commune.nom
      }
    } : null

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
          />
        ) : (
          <CommuneContext
            commune={commune}
            addresses={addresses}
            communeContour={communeContour}
            actions={actions}
          />
        )}
      </div>
    )
  }
}

export default Context
