import React from 'react'
import PropTypes from 'prop-types'

import EditableItem from '../../item/editable-item'

import VoieForm from './voie-form'

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
    input: '',
    editing: false,
    error: null
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
      renameVoie: PropTypes.func.isRequired,
      cancelChange: PropTypes.func.isRequired
    }).isRequired
  }

  handleSubmit = async () => {
    const {input} = this.state
    const {voie, actions} = this.props
    let error

    try {
      if (input.length > 0) {
        await actions.renameVoie(voie, input)
      }
    } catch (err) {
      error = err
    }

    this.setState({
      editing: Boolean(error),
      input: error ? input : '',
      error
    })
  }

  delete = async () => {
    const {voie, actions} = this.props
    let error

    try {
      await actions.deleteItem(voie)
    } catch (err) {
      error = new Error(err)
    }

    this.setState({
      editing: !error
    })
  }

  cancelChange = async () => {
    const {voie, actions} = this.props
    let error

    try {
      await actions.cancelChange(voie)
    } catch (err) {
      error = err
    }

    this.setState({
      editing: !error
    })
  }

  toggleForm = () => {
    this.setState(state => {
      return {
        editing: !state.editing
      }
    })
  }

  handleInput = input => {
    this.setState({input})
  }

  hasChange = () => {
    const {voie} = this.props
    return voie.deleted || voie.edited
  }

  render() {
    const {input, editing, error} = this.state
    const {codeCommune, voie, actions} = this.props
    const item = {
      id: voie.idVoie,
      name: voie.nomVoie,
      newName: voie.edited ? voie.modified.nomVoie : null,
      meta: voie.numeros ? getNumeros(voie) : 'Toponyme',
      status: getStatus(voie),
      handleClick: () => actions.select(codeCommune, voie.codeVoie)
    }

    return (
      <EditableItem item={item} toggleForm={this.toggleForm}>
        {editing && (
          <VoieForm
            input={input}
            voie={voie}
            handleInput={this.handleInput}
            submit={this.handleSubmit}
            deleteVoie={this.delete}
            cancelChange={this.hasChange() ? this.cancelChange : null}
            error={error}
          />
        )}
      </EditableItem>
    )
  }
}

export default VoieItem
