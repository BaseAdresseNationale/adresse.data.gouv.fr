import React from 'react'
import PropTypes from 'prop-types'

import NumeroForm from './voie/numero-form'

class NumeroFormWrapper extends React.Component {
  initialState = {
    editing: false,
    type: null,
    position: null
  }

  state = this.initialState

  static propTypes = {
    numero: PropTypes.shape({
      numeroComplet: PropTypes.string.isRequired,
      modified: PropTypes.object
    }).isRequired,
    actions: PropTypes.shape({
      deleteItem: PropTypes.func.isRequired,
      updateNumero: PropTypes.func.isRequired
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

  handleType = type => {
    this.setState({type})
  }

  handlePosition = position => {
    this.setState({position})
  }

  edit = async () => {
    const {position, type} = this.state
    const {numero, actions} = this.props

    try {
      if (position || type) {
        const newPosition = position ? position : {...numero.positions[0]}
        newPosition.type = type || newPosition.type

        this.setState(this.initialState)

        await actions.updateNumero(numero, {
          positions: [newPosition]
        })
      }
    } catch (error) {
      this.setState({error})
    }
  }

  render() {
    const {type, position, error} = this.state
    const {numero} = this.props
    const newType = type || (numero.modified ? numero.modified.positions[0].type : null)
    const newPosition = position || (numero.modified ? numero.modified.positions[0] : null)

    return (
      <NumeroForm
        numero={numero}
        type={newType}
        position={newPosition}
        handleType={this.handleType}
        handlePosition={this.handlePosition}
        updateNumero={position || type ? this.edit : null}
        deleteNumero={this.delete}
        cancelChange={this.cancel}
        error={error}
      />
    )
  }
}

export default NumeroFormWrapper
