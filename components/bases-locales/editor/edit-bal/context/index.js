import React from 'react'
import PropTypes from 'prop-types'

import {communeVoiesToGeoJson, communeNumerosToGeoJson} from '../../../../../lib/geojson'
import {getStatus, getType, getName} from '../../../../../lib/bal/item'

import CommuneVisualizer from '../../../../commune-visualizer'

import Head from './head'
import CommuneContext from './commune/commune-context'
import VoieContext from './voie/voie-context'
import NumeroContext from './numero-context'

class Context extends React.Component {
  static propTypes = {
    context: PropTypes.object.isRequired,
    commune: PropTypes.object.isRequired,
    actions: PropTypes.shape({
      addItem: PropTypes.func.isRequired,
      select: PropTypes.func.isRequired
    }).isRequired,
    voie: PropTypes.object,
    numero: PropTypes.object
  }

  static defaultProps = {
    voie: null,
    numero: null
  }

  getParent = () => {
    const {context, commune, voie} = this.props
    const type = getType(context)

    if (type === 'commune') {
      return 'Communes'
    }

    if (type === 'voie') {
      return commune.nom
    }

    if (type === 'numero') {
      return getName(voie)
    }
  }

  getPrevious = () => {
    const {context, commune, voie, actions} = this.props
    const type = getType(context)

    if (type === 'commune') {
      actions.select(null)
    } else if (type === 'voie') {
      actions.select(commune.code)
    } else if (type === 'numero') {
      actions.select(commune.code, voie.codeVoie)
    }
  }

  render() {
    const {context, commune, voie, numero, actions} = this.props
    const addresses = communeNumerosToGeoJson(commune)
    const voies = communeVoiesToGeoJson(commune)

    return (
      <div>
        <Head
          name={getName(context)}
          status={getStatus(context)}
          parent={this.getParent()}
          previous={() => this.getPrevious()}
        />

        <CommuneVisualizer
          context={context}
          commune={commune}
          voies={voies}
          numeros={addresses}
          voie={voie}
          numero={numero}
          actions={actions}
        />

        {numero ? (
          <NumeroContext
            numero={numero}
            actions={actions}
          />
        ) : voie ? (
          <VoieContext
            commune={commune}
            voie={voie}
            addNumero={actions.addItem}
            actions={actions}
          />
        ) : (
          <CommuneContext commune={commune} actions={actions} />
        )}
      </div>
    )
  }
}

export default Context
