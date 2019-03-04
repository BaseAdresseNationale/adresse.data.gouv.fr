import React from 'react'
import PropTypes from 'prop-types'

import CommuneContext from './commune/commune-context'
import VoieContext from './voie/voie-context'
import NumeroContext from './numero/numero-context'

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

    return (
      numero ? (
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
      )
    )
  }
}

export default Context
