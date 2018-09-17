import React from 'react'
import PropTypes from 'prop-types'

import NumeroItem from './numero-item'
import CreateNumeroWrapper from './create-numero-wrapper'
import CreateNumero from './create-numero'

class NumerosList extends React.Component {
  state = {
    numeroComplet: '',
    displayForm: false,
    error: null
  }

  static propTypes = {
    codeCommune: PropTypes.string.isRequired,
    codeVoie: PropTypes.string.isRequired,
    numeros: PropTypes.object.isRequired,
    actions: PropTypes.shape({
      addItem: PropTypes.func.isRequired,
      select: PropTypes.func.isRequired
    }).isRequired
  }

  handleInput = input => {
    this.setState({
      numeroComplet: input,
      error: null
    })
  }

  addNumero = async () => {
    const {numeroComplet} = this.state
    const {actions} = this.props
    let error = null

    try {
      await actions.addItem({numeroComplet})
    } catch (err) {
      error = err
    }

    this.setState({
      numeroComplet: error ? numeroComplet : '',
      displayForm: Boolean(error),
      error
    })
  }

  toggleForm = () => {
    this.setState(state => {
      return {
        displayForm: !state.displayForm
      }
    })
  }

  render() {
    const {numeroComplet, displayForm, error} = this.state
    const {codeCommune, codeVoie, numeros, actions} = this.props

    return (
      <div className='numeros-list'>
        <CreateNumeroWrapper toggleForm={this.toggleForm}>
          {displayForm && (
            <CreateNumero
              input={numeroComplet}
              handleInput={this.handleInput}
              handleSubmit={this.addNumero}
              error={error}
            />
          )}
        </CreateNumeroWrapper>

        {Object.keys(numeros).map(n => {
          const numero = numeros[n]
          return (
            <NumeroItem
              key={n}
              codeCommune={codeCommune}
              codeVoie={codeVoie}
              numero={numero}
              actions={actions}
            />
          )
        })}

        <style jsx>{`
          .numeros-list {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: content;
          }
        `}</style>
      </div>
    )
  }
}

export default NumerosList
