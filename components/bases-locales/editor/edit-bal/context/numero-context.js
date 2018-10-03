import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../../../styles/theme'
import getStatus from '../../../../../lib/bal/item'

import Head from './head'
import NumeroFormWrapper from './numero-form-wrapper'

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
    actions: PropTypes.shape({
      select: PropTypes.func.isRequired
    }).isRequired
  }

  render() {
    const {codeCommune, voie, numero, actions} = this.props

    return (
      <div>
        <Head
          name={numero.numeroComplet}
          status={getStatus(numero)}
          parent={voie.modified ? voie.modified.nomVoie : voie.nomVoie}
          previous={() => actions.select(codeCommune, voie.codeVoie)}
        />

        <div className='shadow-box'>
          <NumeroFormWrapper
            numero={numero}
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
