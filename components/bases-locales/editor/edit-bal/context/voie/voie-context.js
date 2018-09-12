import React from 'react'
import PropTypes from 'prop-types'

import Head from '../head'

import CreateNumero from './create-numero'
import NumerosList from './numeros-list'

class VoieContext extends React.Component {
  state = {
    displayForm: false
  }

  static propTypes = {
    commune: PropTypes.shape({
      nom: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired
    }).isRequired,
    voie: PropTypes.shape({
      nomVoie: PropTypes.string.isRequired,
      numeros: PropTypes.object
    }).isRequired,
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
    const {commune, voie, actions} = this.props
    const {numeros} = voie

    return (
      <div>
        <Head
          name={voie.nomVoie}
          parent={commune.nom}
          toggleForm={this.toggleForm}
          previous={() => actions.select(commune.code)}
        >
          {displayForm && (
            <CreateNumero
              input={numeroComplet}
              handleInput={this.handleInput}
              handleSubmit={this.addNumero}
              error={error}
            />
          )}
        </Head>

        {numeros && Object.keys(numeros).length > 0 ? (
          <div className='voies'>
            <b>Numéros de : {voie.nomVoie}</b>
            <NumerosList
              codeCommune={commune.code}
              codeVoie={voie.codeVoie}
              numeros={numeros}
              actions={actions}
            />
          </div>
        ) : (
          <div>Aucun numéro</div>
        )}

        <style jsx>{`
            .voies {
              margin: 2em 0;
            }
        `}</style>
      </div>

    )
  }
}

export default VoieContext
