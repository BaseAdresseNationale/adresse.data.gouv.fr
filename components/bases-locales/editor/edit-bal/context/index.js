import React from 'react'
import PropTypes from 'prop-types'

import {FormContext} from '..'

import CommuneContext from './commune/commune-context'
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
      <FormContext.Consumer>
        {context => (
          <div>
            {numero ? (
              <NumeroContext numero={numero} />
            ) : voie ? (
              <VoieContext voie={voie} />
            ) : (
              <CommuneContext
                commune={commune}
                addVoie={context.actions.addItem}
              />
            )}
          </div>
        )}
      </FormContext.Consumer>
    )
  }
}

export default Context
