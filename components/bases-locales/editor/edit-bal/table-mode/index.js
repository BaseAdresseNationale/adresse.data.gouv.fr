import React from 'react'
import PropTypes from 'prop-types'

import CommuneContext from './commune/commune-context'
import VoieContext from './voie/voie-context'
import NumeroContext from './numero-context'

class TableMode extends React.Component {
  static propTypes = {
    commune: PropTypes.object.isRequired,
    actions: PropTypes.shape({
      addItem: PropTypes.func.isRequired
    }).isRequired,
    addresses: PropTypes.array,
    voie: PropTypes.object,
    numero: PropTypes.object
  }

  static defaultProps = {
    addresses: null,
    voie: null,
    numero: null
  }

  render() {
    const {addresses, commune, voie, numero, actions} = this.props
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

export default TableMode
