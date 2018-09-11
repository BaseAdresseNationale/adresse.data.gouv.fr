import React from 'react'
import PropTypes from 'prop-types'

import EditableItem from '../../item/editable-item'

import NumeroForm from './numero-form'

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
    editing: false
  }

  static propTypes = {
    codeCommune: PropTypes.string.isRequired,
    codeVoie: PropTypes.string.isRequired,
    numero: PropTypes.shape({
      numeroComplet: PropTypes.string.isRequired
    }).isRequired,
    actions: PropTypes.shape({
      deleteItem: PropTypes.func.isRequired,
      select: PropTypes.func.isRequired
    }).isRequired
  }

  delete = async () => {
    const {numero, actions} = this.props
    let error

    try {
      await actions.deleteItem(numero)
    } catch (err) {
      error = err
    }

    this.setState({error})
  }

  cancel = async () => {
    const {numero, actions} = this.props
    let error

    try {
      await actions.cancelChange(numero)
    } catch (err) {
      error = err
    }

    this.setState({error})
  }

  toggleEdit = () => {
    this.setState(state => {
      return {
        editing: !state.editing
      }
    })
  }

  render() {
    const {editing, error} = this.state
    const {codeCommune, codeVoie, numero, actions} = this.props
    const item = {
      id: numero.id,
      name: numero.numeroComplet,
      status: getStatus(numero),
      handleClick: () => actions.select(codeCommune, codeVoie, numero.numeroComplet)
    }

    return (
      <EditableItem item={item} toggleForm={this.toggleEdit}>
        {editing && (
          <NumeroForm
            numero={numero}
            deleteNumero={this.delete}
            cancel={this.cancel}
            error={error}
          />
        )}
      </EditableItem>
    )
  }
}

export default NumeroItem
