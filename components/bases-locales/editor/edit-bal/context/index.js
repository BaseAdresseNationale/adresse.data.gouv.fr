import React from 'react'
import PropTypes from 'prop-types'

import {contoursToGeoJson, communeVoiesToGeoJson, communeNumerosToGeoJson} from '../../../../../lib/geojson'

import CommuneVisualizer from '../../../../commune-visualizer'

import CommuneContext from './commune/commune-context'
import VoieContext from './voie/voie-context'
import NumeroContext from './numero-context'

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
    const addresses = communeNumerosToGeoJson(commune)
    const voies = communeVoiesToGeoJson(commune)
    const communeContour = commune.contour ? contoursToGeoJson([commune]) : null
    let CommuneMap

    if (addresses) {
      CommuneMap = addresses ? () => (
        <CommuneVisualizer
          codeCommune={commune.code}
          voies={voies}
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
