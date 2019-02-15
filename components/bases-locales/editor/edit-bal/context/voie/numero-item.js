import React from 'react'
import PropTypes from 'prop-types'

import {getStatus, getNumeroPositions} from '../../../../../../lib/bal/item'

import EditNumero from './edit-numero'

class NumeroItem extends React.Component {
  static propTypes = {
    codeCommune: PropTypes.string.isRequired,
    codeVoie: PropTypes.string.isRequired,
    numero: PropTypes.shape({
      numeroComplet: PropTypes.string.isRequired,
      modified: PropTypes.object
    }).isRequired,
    actions: PropTypes.shape({
      select: PropTypes.func.isRequired
    }).isRequired
  }

  render() {
    const {codeCommune, codeVoie, numero, actions} = this.props
    const positions = getNumeroPositions(numero)
    const item = {
      name: numero.numeroComplet,
      status: getStatus(numero),
      warning: positions ? null : 'Ce numréro n’a pas de position',
      handleClick: () => actions.select(codeCommune, codeVoie, numero.numeroComplet)
    }

    return (
      <EditNumero numero={numero} item={item} actions={actions} />
    )
  }
}

export default NumeroItem
