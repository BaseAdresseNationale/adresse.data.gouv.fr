import React from 'react'
import PropTypes from 'prop-types'

import VoieEditor from './voie-editor'
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

const getNumeros = voie => {
  switch (voie.numeros.length) {
    case 0:
      return 'Aucun numéro'
    case 1:
      return '1 numéro'
    default:
      return `${voie.numeros.length} numéros`
  }
}

class VoieItem extends React.Component {
  state = {
    editing: false,
    input: '',
    error: null
  }

  static propTypes = {
    commune: PropTypes.shape({
      voies: PropTypes.array.isRequired
    }).isRequired,
    voie: PropTypes.object.isRequired,
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
    const {voie, commune, itemActions} = this.props
    const {renameItem} = itemActions

    this.setState(() => {
      if (input.length > 0) {
        if (commune.voies.find(voie => voie.voieNom === input)) {
          return {
            error: 'Ce nom de voie est déjà utilisé.'
          }
        }

        if (input !== voie.nomVoie) {
          renameItem(voie, input)
        }

        return {
          input: '',
          editing: false
        }
      }

      return {
        error: 'Indiquer le nom de la voie.'
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
    const {voie, itemActions} = this.props
    const {cancelChanges, deleteItem} = itemActions
    const actions = [{type: 'edit', func: this.toggleEdit}]

    if (editing) {
      return [
        {type: 'valid', func: this.handleSubmit},
        {type: 'cancel', func: this.toggleEdit}
      ]
    }

    if (voie.deleted) {
      actions.push({type: 'cancel', func: () => cancelChanges(voie)})
    } else {
      actions.push({type: 'delete', func: () => deleteItem(voie)})
    }

    return actions
  }

  render() {
    const {input, editing, error} = this.state
    const {voie, itemActions} = this.props
    const {changeContext} = itemActions
    const actions = this.getActions()

    return (
      <Item
        name={voie.nomVoie}
        newName={voie.newName}
        childs={voie.numeros ? getNumeros(voie) : 'Toponyme'}
        status={getStatus(voie)}
        handleClick={() => changeContext(voie)}
        actions={actions}
      >
        {editing && (
          <VoieEditor
            input={input}
            placeholder={voie.nomVoie}
            handleInput={this.handleInput}
            submit={this.handleSubmit}
            error={error}
          />
        )}
      </Item>
    )
  }
}

export default VoieItem
