import React from 'react'
import PropTypes from 'prop-types'

import CreateItemWrapper from '../../create-item-wrapper'

import VoieItem from './voie-item'
import CreateVoie from './create-voie'

class VoiesList extends React.Component {
  state = {
    nomVoie: '',
    displayForm: false,
    error: null
  }

  static propTypes = {
    codeCommune: PropTypes.string.isRequired,
    voies: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
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
    const {displayForm, nomVoie, error} = this.state
    const {codeCommune, voies, actions} = this.props

    return (
      <div className='voies-list'>
        <CreateItemWrapper
          listName='Liste des voies'
          buttonText='Ajouter une voie'
          toggleForm={this.toggleForm}
        >
          {displayForm && (
            <CreateVoie
              input={nomVoie}
              handleInput={this.handleInput}
              handleSubmit={this.addVoie}
              error={error}
            />
          )}
        </CreateItemWrapper>

        <div className='list'>
          {Object.keys(voies).map(voie => (
            <VoieItem
              key={voie}
              voie={voies[voie]}
              codeCommune={codeCommune}
              actions={actions}
            />
          ))}
        </div>

        <style jsx>{`
          .voies-list {
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

export default VoiesList
