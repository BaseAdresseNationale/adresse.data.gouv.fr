import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../../../styles/theme'
import getStatus from '../../../../../lib/bal/item'

import Notification from '../../../../notification'

import Head from './head'
import NumeroForm from './voie/numero-form'

class NumeroContext extends React.Component {
  static propTypes = {
    codeCommune: PropTypes.string.isRequired,
    voie: PropTypes.shape({
      nomVoie: PropTypes.string.isRequired,
      codeVoie: PropTypes.string.isRequired
    }).isRequired,
    numero: PropTypes.shape({
      numeroComplet: PropTypes.string.isRequired,
      modified: PropTypes.object
    }).isRequired,
    bounds: PropTypes.object,
    actions: PropTypes.shape({
      select: PropTypes.func.isRequired
    }).isRequired
  }

  static defaultProps = {
    bounds: null
  }

  render() {
    const {codeCommune, voie, numero, bounds, actions} = this.props
    const positions = numero.edited ? numero.modified.positions : numero.positions

    return (
      <div>
        <Head
          name={numero.numeroComplet}
          status={getStatus(numero)}
          parent={voie.modified ? voie.modified.nomVoie : voie.nomVoie}
          previous={() => actions.select(codeCommune, voie.codeVoie)}
        />

        {positions.length === 0 && (
          <Notification type='warning'>
            Ce numéro n’a pas de position.
          </Notification>
        )}

        <div className='shadow-box'>
          <NumeroForm
            numero={numero}
            bounds={bounds}
            actions={actions}
          />
        </div>

        <style jsx>{`
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
