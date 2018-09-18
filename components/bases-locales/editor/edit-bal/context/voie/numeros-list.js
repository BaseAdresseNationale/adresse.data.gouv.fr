import React from 'react'
import PropTypes from 'prop-types'

import CreateItemWrapper from '../../create-item-wrapper'

import NumeroItem from './numero-item'
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
        <CreateItemWrapper
          listName='Liste des numéros'
          buttonText='Ajouter un numéro'
          toggleForm={this.toggleForm}
        >
          {displayForm && (
            <CreateNumero
              input={numeroComplet}
              handleInput={this.handleInput}
              handleSubmit={this.addNumero}
              error={error}
            />
          )}
        </CreateItemWrapper>

        <div className='list'>
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
        </div>

        <style jsx>{`
          .numeros-list {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: content;
          }

          .list {
            margin: 0.5em 0;
          }
        `}</style>
      </div>
    )
  }
}

export default NumerosList
