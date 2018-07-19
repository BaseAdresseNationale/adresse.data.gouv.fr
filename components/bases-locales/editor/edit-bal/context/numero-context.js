import React from 'react'
import PropTypes from 'prop-types'

import NumeroItem from '../item/numero-item'
import ClosablePanel from '../closable-panel'
import {ItemContext} from '..'

class numeroContext extends React.Component {
  static propTypes = {
    commune: PropTypes.object.isRequired,
    voie: PropTypes.object.isRequired,
    numero: PropTypes.shape({
      numeroComplet: PropTypes.string.isRequired
    }).isRequired
  }

  render() {
    const {commune, voie, numero} = this.props

    return (
      <div>
        <ItemContext.Consumer>
          {actions => (
            <ClosablePanel title={numero.numeroComplet} handleClose={actions.previousContext}>
              <NumeroItem
                commune={commune}
                voie={voie}
                numero={numero}
                itemActions={actions}
              />
            </ClosablePanel>
          )}
        </ItemContext.Consumer>

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
