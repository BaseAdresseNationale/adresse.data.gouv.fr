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
  const numeroCount = Object.keys(voie.numeros).length
  switch (numeroCount) {
    case 0:
      return 'Aucun numéro'
    case 1:
      return '1 numéro'
    default:
      return `${numeroCount} numéros`
  }
}

class VoieItem extends React.Component {
  state = {
    editing: false,
    input: ''
  }

  static propTypes = {
    codeCommune: PropTypes.string.isRequired,
    voie: PropTypes.shape({
      codeVoie: PropTypes.string.isRequired,
      numeros: PropTypes.object.isRequired
    }).isRequired,
    actions: PropTypes.shape({
      select: PropTypes.func.isRequired,
      deleteItem: PropTypes.func.isRequired,
      renameItem: PropTypes.func.isRequired,
      cancelChange: PropTypes.func.isRequired
    }).isRequired,
    error: PropTypes.string
  }

  static defaultProps = {
    error: null
  }

  handleSubmit = async () => {
    const {input} = this.state
    const {voie, actions} = this.props

    await actions.renameItem(voie, input)
    this.setState({editing: false})
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
    const {voie, actions} = this.props
    const {cancelChange, deleteItem} = actions
    const actionList = [{type: 'edit', func: this.toggleEdit}]

    if (editing) {
      return [
        {type: 'valid', func: this.handleSubmit},
        {type: 'cancel', func: this.toggleEdit}
      ]
    }

    if (voie.deleted) {
      actionList.push({type: 'cancel', func: () => cancelChange(voie)})
    } else {
      actionList.push({type: 'delete', func: () => deleteItem(voie)})
    }

    return actionList
  }

  render() {
    const {input, editing} = this.state
    const {codeCommune, voie, actions, error} = this.props
    console.log('TCL: VoieItem -> render -> error', error);
    const actionList = this.getActions()
    const numeros = voie.numeros ? getNumeros(voie) : 'Toponyme'

    return (
      <Item
        name={voie.nomVoie}
        newName={voie.change ? voie.change.value : null}
        childs={numeros}
        status={getStatus(voie)}
        handleClick={() => actions.select(codeCommune, voie.codeVoie)}
        actions={actionList}
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
