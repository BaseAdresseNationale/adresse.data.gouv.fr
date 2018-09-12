import React from 'react'
import PropTypes from 'prop-types'

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
    actions: PropTypes.shape({
      addItem: PropTypes.func.isRequired,
      select: PropTypes.func.isRequired
    }).isRequired
  }

  handleInput = input => {
    this.setState({
      nomVoie: input,
      error: null
    })
  }

  addVoie = async () => {
    const {nomVoie} = this.state
    const {actions} = this.props
    let error = null

    try {
      await actions.addItem({nomVoie})
    } catch (err) {
      error = err
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
    const {commune, actions} = this.props

    return (
      <div>
        <Head
          name={commune.nom}
          parent='Communes'
          toggleForm={this.toggleForm}
          previous={() => actions.select(null)}
        >
          {displayForm && (
            <CreateVoie
              input={nomVoie}
              handleInput={this.handleInput}
              handleSubmit={this.addVoie}
              actions={actions}
              error={error}
            />
          )}
        </Head>

        <div className='voies'>
          <b>Voies de : {commune.nom}</b>
          <VoiesList
            voies={commune.voies}
            codeCommune={commune.code}
            actions={actions}
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
