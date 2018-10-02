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
        if (numero.positions.length > 0) {
          geojson.features.push({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: numero.edited ? numero.modified.positions[0].coords : numero.positions[0].coords
            },
            properties: {
              ...numero,
              codeCommune: commune.code,
              codeVoie: voie.codeVoie,
              source: numero.positions[0].source,
              type: numero.positions[0].type,
              lastUpdate: numero.positions[0].dateMAJ
            }
          })
        }
      })
    }
  })

  return geojson
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

    return (
      <div>
        {numero ? (
          <NumeroContext
            codeCommune={commune.code}
            voie={voie}
            numero={numero}
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
            actions={actions}
          />
        )}
      </div>
    )
  }
}

export default Context
