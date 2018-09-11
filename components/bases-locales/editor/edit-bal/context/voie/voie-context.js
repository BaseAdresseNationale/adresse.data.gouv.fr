import React, {Fragment} from 'react'
import PropTypes from 'prop-types'

import Head from '../head'
import {FormContext} from '../..'

import CreateNumero from './create-numero'
import NumerosList from './numeros-list'

class VoieContext extends React.Component {
  state = {
    displayForm: false
  }

  static propTypes = {
    voie: PropTypes.shape({
      nomVoie: PropTypes.string.isRequired,
      numeros: PropTypes.object
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
    const {addNumero} = this.props
    let error = null

    try {
      await addNumero({numeroComplet})
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
    const {voie} = this.props
    const {numeros} = voie

    return (
      <div>
        <FormContext.Consumer>
          {context => (
            <Fragment>
              <Head
                name={voie.nomVoie}
                parent={context.commune.nom}
                toggleForm={this.toggleForm}
                previous={() => context.actions.select(context.commune.code)}
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
                    codeCommune={context.commune.code}
                    codeVoie={voie.codeVoie}
                    numeros={numeros}
                    actions={context.actions}
                  />
                </div>
              ) : (
                <div>Aucun numéro</div>
              )}
            </Fragment>
          )}
        </FormContext.Consumer>

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
