import React from 'react'
import PropTypes from 'prop-types'

import NumeroForm from './numero-form'
import EditNumero from './edit-numero'

const getStatus = item => {
  let status = null

  if (item.deleted) {
    status = 'deleted'
  } else if (item.created) {
    status = 'created'
  } else if (item.edited) {
    status = 'edited'
  }

  return status
}

class NumeroItem extends React.Component {
  state = {
    editing: false,
    position: null
  }

  static propTypes = {
    codeCommune: PropTypes.string.isRequired,
    codeVoie: PropTypes.string.isRequired,
    numero: PropTypes.shape({
      numeroComplet: PropTypes.string.isRequired,
      modified: PropTypes.object
    }).isRequired,
    actions: PropTypes.shape({
      deleteItem: PropTypes.func.isRequired,
      updateNumero: PropTypes.func.isRequired,
      select: PropTypes.func.isRequired
    }).isRequired
  }

  delete = async () => {
    const {numero, actions} = this.props
    await actions.deleteItem(numero)
  }

  cancel = async () => {
    const {numero, actions} = this.props
    await actions.cancelChange(numero)
    this.setState({position: null})
  }

  handlePosition = position => {
    this.setState({position})
  }

  edit = async () => {
    const {position} = this.state
    const {numero, actions} = this.props

    try {
      if (position) {
        await actions.updateNumero(numero, {
          positions: [position]
        })

        this.setState({editing: false, position: null})
      }
    } catch (error) {
      this.setState({error})
    }
  }

  toggleEdit = () => {
    this.setState(state => {
      return {
        editing: !state.editing,
        position: state.editing ? state.position : null
      }
    })
  }

  render() {
    const {editing, position, error} = this.state
    const {codeCommune, codeVoie, numero, actions} = this.props
    const item = {
      name: numero.numeroComplet,
      status: getStatus(numero),
      handleClick: () => actions.select(codeCommune, codeVoie, numero.numeroComplet)
    }
    let pos = position

    if (!pos && numero.modified) {
      pos = numero.modified.positions[0]
    }

    return (
      <EditNumero item={item} toggleForm={this.toggleEdit}>
        {editing && (
          <NumeroForm
            numero={numero}
            position={pos}
            handlePosition={this.handlePosition}
            updateNumero={position ? this.edit : null}
            deleteNumero={this.delete}
            cancelChange={this.cancel}
            error={error}
          />
        )}
      </EditNumero>
    )
  }
}

export default NumeroItem
