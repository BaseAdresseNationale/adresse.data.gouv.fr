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
    input: ''
  }

  static propTypes = {
    codeCommune: PropTypes.string.isRequired,
    codeVoie: PropTypes.string.isRequired,
    numero: PropTypes.shape({
      numeroComplet: PropTypes.string.isRequired
    }).isRequired,
    actions: PropTypes.shape({
      deleteItem: PropTypes.func.isRequired,
      renameItem: PropTypes.func.isRequired,
      select: PropTypes.func.isRequired
    }).isRequired,
    error: PropTypes.string
  }

  static defaultProps = {
    error: null
  }

  handleSubmit = () => {
    const {input} = this.state
    const {numero, actions} = this.props
    const {renameItem} = actions

    renameItem(numero, input)
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
    const {numero, actions} = this.props
    const {select, deleteItem} = actions
    const actionList = [{type: 'edit', func: this.toggleEdit}]

    if (editing) {
      return [
        {type: 'valid', func: this.handleSubmit},
        {type: 'cancel', func: this.toggleEdit}
      ]
    }

    if (numero.deleted) {
      actionList.push({type: 'cancel', func: () => select(numero)})
    } else {
      actionList.push({type: 'delete', func: () => deleteItem(numero)})
    }

    return actionList
  }

  render() {
    const {input, editing} = this.state
    const {codeCommune, codeVoie, numero, actions, error} = this.props
    const actionList = this.getActions()

    return (
      <Item
        name={numero.numeroComplet}
        newName={numero.newName}
        status={getStatus(numero)}
        handleClick={() => actions.select(codeCommune, codeVoie, numero.numeroComplet)}
        actions={actionList}
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
