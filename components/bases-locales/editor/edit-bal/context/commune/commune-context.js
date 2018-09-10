import React from 'react'
import PropTypes from 'prop-types'

import {FormContext} from '../..'

import Head from '../head'

import VoiesList from './voies-list'
import CreateVoie from './create-voie'

class CommuneContext extends React.Component {
  state = {
    nomVoie: '',
    displayForm: false,
    error: null
  }

  static propTypes = {
    commune: PropTypes.shape({
      nom: PropTypes.string.isRequired,
      voies: PropTypes.object.isRequired
    }).isRequired,
    addVoie: PropTypes.func.isRequired
  }

  handleInput = input => {
    this.setState({
      nomVoie: input,
      error: null
    })
  }

  addVoie = async () => {
    const {nomVoie} = this.state
    const {addVoie} = this.props
    let error = null

    try {
      await addVoie({nomVoie})
    } catch (err) {
      error = new Error(error)
    }

    this.setState({
      nomVoie: error ? nomVoie : '',
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
    const {nomVoie, displayForm, error} = this.state
    const {commune} = this.props

    return (
      <div>
        <FormContext.Consumer>
          {context => (
            <Head
              name={commune.nom}
              parent='Communes'
              toggleForm={this.toggleForm}
              previous={() => context.actions.select(null)}
            >
              {displayForm && (
                <CreateVoie
                  input={nomVoie}
                  handleInput={this.handleInput}
                  handleSubmit={this.addVoie}
                  error={error}
                />
              )}
            </Head>
          )}
        </FormContext.Consumer>

        <div className='voies'>
          <b>Voies de : {commune.nom}</b>
          <VoiesList
            voies={commune.voies}
            codeCommune={commune.code}
          />
        </div>

        <style jsx>{`
          .voies {
            margin: 2em 0;
          }
        `}</style>
      </div>
    )
  }
}

export default CommuneContext
