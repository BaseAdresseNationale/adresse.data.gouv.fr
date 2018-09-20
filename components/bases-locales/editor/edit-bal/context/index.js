import React from 'react'
import PropTypes from 'prop-types'

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
    numero: PropTypes.object,
    contour: PropTypes.object
  }

  static defaultProps = {
    voie: null,
    numero: null,
    contour: null
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      window.scrollTo(0, 0)
    }
  }

  render() {
    const {commune, voie, numero, contour, actions} = this.props

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
            contour={contour}
            addNumero={actions.addItem}
            actions={actions}
          />
        ) : (
          <CommuneContext
            commune={commune}
            actions={actions}
          />
        )}
      </div>
    )
  }
}

export default Context
