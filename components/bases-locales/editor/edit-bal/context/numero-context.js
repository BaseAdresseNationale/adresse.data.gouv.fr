import React from 'react'
import PropTypes from 'prop-types'

import NumeroItem from '../item/numero-item'
import ClosablePanel from '../closable-panel'
import {FormContext} from '..'

class numeroContext extends React.Component {
  static propTypes = {
    numero: PropTypes.shape({
      numeroComplet: PropTypes.string.isRequired
    }).isRequired
  }

  render() {
    const {numero} = this.props

    return (
      <div>
        <FormContext.Consumer>
          {context => (
            <ClosablePanel title={numero.numeroComplet} handleClose={() => context.actions.select(context.commune.code, context.voie.codeVoie)}>
              <NumeroItem
                codeCommune={context.commune.code}
                codeVoie={context.voie.codeVoie}
                numero={numero}
                actions={context.actions}
              />
            </ClosablePanel>
          )}
        </FormContext.Consumer>

        <style jsx>{`
          .numeros {
            margin: 2em 0;
          }
        `}</style>
      </div>
    )
  }
}

export default numeroContext
