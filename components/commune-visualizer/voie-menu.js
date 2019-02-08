import React from 'react'
import PropTypes from 'prop-types'

import {hasChange} from '../../lib/bal/item'

import VoieForm from '../bases-locales/editor/edit-bal/context/commune/voie-form'

class VoieMenu extends React.Component {
  state = {
    input: '',
    error: null
  }

  static propTypes = {
    voie: PropTypes.shape({
      nomVoie: PropTypes.string.isRequired
    }).isRequired,
    actions: PropTypes.shape({
      deleteItem: PropTypes.func.isRequired,
      renameVoie: PropTypes.func.isRequired,
      cancelChange: PropTypes.func.isRequired
    }).isRequired,
    close: PropTypes.func.isRequired
  }

  handleSubmit = async () => {
    const {input} = this.state
    const {voie, actions, close} = this.props
    let error

    try {
      if (input.length > 0) {
        await actions.renameVoie(voie, input)
        close()
      }
    } catch (err) {
      error = err
    }

    this.setState({
      input: error ? input : '',
      error
    })
  }

  delete = async () => {
    const {voie, actions, close} = this.props

    await actions.deleteItem(voie)
    close()
  }

  cancelChange = async () => {
    const {voie, actions, close} = this.props
    let error

    try {
      await actions.cancelChange(voie)
      close()
    } catch (err) {
      error = err
    }

    this.setState({error})
  }

  handleInput = input => {
    this.setState({input})
  }

  render() {
    const {input, error} = this.state
    const {voie} = this.props

    return (
      <VoieForm
        input={input}
        voie={voie}
        handleInput={this.handleInput}
        submit={this.handleSubmit}
        deleteVoie={this.delete}
        cancelChange={hasChange(voie) ? this.cancelChange : null}
        error={error}
      />
    )
  }
}

export default VoieMenu
