import React from 'react'
import PropTypes from 'prop-types'

import CommuneContext from './commune-context'
import VoieContext from './voie-context'
import NumeroContext from './numero-context'

class Context extends React.Component {
  static propTypes = {
    commune: PropTypes.object.isRequired,
    voie: PropTypes.object,
    numero: PropTypes.object
  }

  static defaultProps = {
    voie: null,
    numero: null
  }

  render() {
    const {commune, voie, numero} = this.props

    return (
      <div>
        {numero ? (
          <NumeroContext numero={numero} />
        ) : voie ? (
          <VoieContext voie={voie} />
        ) : (
          <CommuneContext commune={commune} />
        )}
      </div>
    )
  }
}

export default Context
