import React from 'react'
import PropTypes from 'prop-types'

import NumeroEditor from './numero-editor'
import Item from '.'

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
    input: '',
    error: null
  }

  static propTypes = {
    commune: PropTypes.object.isRequired,
    voie: PropTypes.shape({
      numeros: PropTypes.array.isRequired
    }).isRequired,
    numero: PropTypes.shape({
      numeroComplet: PropTypes.string.isRequired
    }).isRequired,
    itemActions: PropTypes.shape({
      changeContext: PropTypes.func.isRequired,
      deleteItem: PropTypes.func.isRequired,
      assignItem: PropTypes.func.isRequired,
      renameItem: PropTypes.func.isRequired,
      cancelChanges: PropTypes.func.isRequired
    }).isRequired
  }

  handleSubmit = () => {
    const {input} = this.state
    const {numero, voie, itemActions} = this.props
    const {renameItem} = itemActions

    this.setState(() => {
      if (input.length > 0) {
        if (numero.numeros.find(numero => numero.numeroComplet === input)) {
          return {
            error: 'Ce numéro est déjà utilisé.'
          }
        }

        if (input !== numero.numeroComplet) {
          renameItem(voie, input)
        }

        return {
          input: '',
          editing: false
        }
      }

      return {
        error: 'Indiquer le numéro.'
      }
    })
  }

  toggleEdit = () => {
    this.setState(state => {
      return {
        editing: !state.editing
      }
    })
  }

  handleInput = input => {
    this.setState({input})
  }

  getActions = () => {
    const {editing} = this.state
    const {numero, itemActions} = this.props
    const {cancelChanges, deleteItem} = itemActions
    const actions = [{type: 'edit', func: this.toggleEdit}]

    if (editing) {
      return [
        {type: 'valid', func: this.handleSubmit},
        {type: 'cancel', func: this.toggleEdit}
      ]
    }

    if (numero.deleted) {
      actions.push({type: 'cancel', func: () => cancelChanges(numero)})
    } else {
      actions.push({type: 'delete', func: () => deleteItem(numero)})
    }

    return actions
  }

  render() {
    const {input, editing, error} = this.state
    const {numero, itemActions} = this.props
    const {changeContext} = itemActions
    const actions = this.getActions()

    return (
      <Item
        name={numero.numeroComplet}
        newName={numero.newName}
        status={getStatus(numero)}
        handleClick={() => changeContext(numero)}
        actions={actions}
      >
        {editing && (
          <NumeroEditor
            input={input}
            placeholder={numero.numeroComplet}
            handleInput={this.handleInput}
            submit={this.handleSubmit}
            error={error}
          />
        )}
      </Item>
    )
  }
}

export default NumeroItem
