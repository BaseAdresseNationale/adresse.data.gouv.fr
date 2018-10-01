import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../../../styles/theme'
import getStatus from '../../../../../lib/bal/item'

import Head from './head'
import NumeroForm from './voie/numero-form'

class NumeroContext extends React.Component {
  state = {
    newPosition: null,
    error: null
  }

  static propTypes = {
    codeCommune: PropTypes.string.isRequired,
    voie: PropTypes.shape({
      nomVoie: PropTypes.string.isRequired,
      codeVoie: PropTypes.string.isRequired
    }).isRequired,
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
    this.setState({newPosition: null})
  }

  handlePosition = position => {
    this.setState({newPosition: position})
  }

  edit = async () => {
    const {newPosition} = this.state
    const {numero, actions} = this.props

    try {
      if (newPosition) {
        await actions.updateNumero(numero, {
          positions: [newPosition]
        })

        this.setState({newPosition: null})
      }
    } catch (error) {
      this.setState({error})
    }
  }

  render() {
    const {newPosition, error} = this.state
    const {codeCommune, voie, numero, actions} = this.props
    const pos = numero.modified ? numero.modified.positions[0] : null

    return (
      <div>
        <Head
          name={numero.numeroComplet}
          status={getStatus(numero)}
          parent={voie.modified ? voie.modified.nomVoie : voie.nomVoie}
          previous={() => actions.select(codeCommune, voie.codeVoie)}
        />

        <div className='shadow-box'>
          <NumeroForm
            numero={numero}
            position={newPosition || pos}
            handlePosition={this.handlePosition}
            updateNumero={newPosition ? this.edit : null}
            deleteNumero={this.delete}
            cancelChange={this.cancel}
            error={error}
          />
        </div>

        <style jsx>{`
          .shadow-box {
            border: 1px solid ${theme.border};
            box-shadow: 0 1px 4px 0 ${theme.boxShadow};
            padding: 1em;
          }
        `}</style>
      </div>
    )
  }
}

export default NumeroContext
