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
        <div>
          <h2>Contexte</h2>
          {numero ? (
            <NumeroContext numero={numero} />
          ) : voie ? (
            <VoieContext voie={voie} />
          ) : (
            <CommuneContext commune={commune} />
          )}
        </div>

        <style jsx>{`
          .childs {
            margin: 2em 0;
          }
        `}</style>
      </div>
    )
  }
}

export default Context
