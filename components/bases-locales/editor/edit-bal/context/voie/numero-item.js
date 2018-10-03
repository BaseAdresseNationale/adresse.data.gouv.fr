import React from 'react'
import PropTypes from 'prop-types'

import getStatus from '../../../../../../lib/bal/item'

import NumeroFormWrapper from '../numero-form-wrapper'
import EditNumero from './edit-numero'

class NumeroItem extends React.Component {
  state = {
    editing: false
  }

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

  toggleEdit = () => {
    this.setState(state => {
      return {
        editing: !state.editing
      }
    })
  }

  render() {
    const {editing} = this.state
    const {codeCommune, codeVoie, numero, actions} = this.props
    const item = {
      name: numero.numeroComplet,
      status: getStatus(numero),
      handleClick: () => actions.select(codeCommune, codeVoie, numero.numeroComplet)
    }

    return (
      <EditNumero item={item} toggleForm={this.toggleEdit}>
        {editing && (
          <NumeroFormWrapper
            numero={numero}
            actions={actions}
          />
        )}
      </EditNumero>
    )
  }
}

export default NumeroItem
