import React from 'react'
import PropTypes from 'prop-types'

import Changes from '../changes'
import CommuneContext from './commune-context'
import VoieContext from './voie-context'
import NumeroContext from './numero-context'

class Context extends React.Component {
  static propTypes = {
    commune: PropTypes.object.isRequired,
    voie: PropTypes.object,
    numero: PropTypes.object,
    changes: PropTypes.object
  }

  static defaultProps = {
    voie: null,
    numero: null,
    changes: null
  }

  render() {
    const {commune, voie, numero, changes} = this.props

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

        {/* {changes && (
          <Changes
            changes={changes}
            cancelChange={actions.cancelChange}
            changeContext={actions.changeContext}
          />
        )} */}

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
