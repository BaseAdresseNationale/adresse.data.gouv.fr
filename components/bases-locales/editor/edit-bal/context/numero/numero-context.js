import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../../../../styles/theme'

import {getNumeroPositions} from '../../../../../../lib/bal/item'

import Notification from '../../../../../notification'

import NumeroForm from './numero-form'

class NumeroContext extends React.Component {
  static propTypes = {
    numero: PropTypes.shape({
      numeroComplet: PropTypes.string.isRequired,
      modified: PropTypes.object
    }).isRequired,
    actions: PropTypes.shape({
      select: PropTypes.func.isRequired
    }).isRequired
  }

  render() {
    const {numero, actions} = this.props
    const positions = getNumeroPositions(numero)

    return (
      <div className='numero-context'>
        {(!positions) && (
          <Notification type='warning'>
            Ce numéro n’a pas de position.
          </Notification>
        )}

        <div className='shadow-box'>
          <NumeroForm numero={numero} actions={actions} />
        </div>

        <style jsx>{`
          .numero-context {
            width: 100%;
          }

          .shadow-box {
            border: 1px solid ${theme.border};
            box-shadow: 0 1px 4px 0 ${theme.boxShadow};
            padding: 1em;
          }
        `}</style>
      </div>
    )
  }
}

export default NumeroContext
