import React from 'react'
import PropTypes from 'prop-types'

import CreateNumero from './create-numero'

class CreateNumeroWrapper extends React.Component {
  initialState = {
    numeroComplet: '',
    type: 'entrée',
    position: null,
    error: null
  }

  state = this.initialState

  static propTypes = {
    bounds: PropTypes.object,
    submit: PropTypes.func.isRequired
  }

  static defaultProps = {
    bounds: null
  }

  handleInput = input => {
    this.setState({
      numeroComplet: input,
      error: null
    })
  }

  handleSelect = type => {
    this.setState({
      type,
      error: null
    })
  }

  handlePosition = position => {
    this.setState({
      position,
      error: null
    })
  }

  addNumero = async () => {
    const {numeroComplet, type, position} = this.state
    const {submit} = this.props

    try {
      if (numeroComplet === '') {
        throw new Error('Indiquez le numéro complet.')
      }

      if (!position) {
        throw new Error('Indiquez l’emplacement du numéro sur la carte.')
      }

      if (!type) {
        throw new Error('Sélectionnez le type de l’adresse.')
      }

      this.setState(async () => {
        await submit({
          numeroComplet,
          positions: [{
            type,
            coords: position
          }]
        })

        return this.initialState
      })
    } catch (err) {
      this.setState({
        error: err
      })
    }
  }

  toggleForm = () => {
    this.setState(state => {
      return {
        displayForm: !state.displayForm
      }
    })
  }

  render() {
    const {numeroComplet, type, position, error} = this.state
    const {bounds} = this.props

    return (
      <CreateNumero
        input={numeroComplet}
        type={type}
        bounds={bounds}
        position={position}
        handleInput={this.handleInput}
        handleSelect={this.handleSelect}
        handlePosition={this.handlePosition}
        handleSubmit={this.addNumero}
        error={error}
      />
    )
  }
}

export default CreateNumeroWrapper
