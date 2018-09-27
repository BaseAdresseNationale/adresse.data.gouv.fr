import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../../../../styles/theme'

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
    const {nomVoie, displayForm, error} = this.state
    const {codeCommune, voies, actions} = this.props

    return (
      <div className='voies-list'>
        <div className='context-head'>
          <div className='shadow-box'>
            <div className='title'>
              <h3>Liste des voies</h3>
            </div>
          </div>

          <div className='divider' />

        </div>

        <CreateItemWrapper
          title='Création d’une voie'
          buttonText='Ajouter une voie'
          displayForm={displayForm}
          toggleForm={this.toggleForm}
        >
          <CreateVoie
            input={nomVoie}
            handleInput={this.handleInput}
            handleSubmit={this.addVoie}
            error={error}
          />
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
          .title {
            display: flex;
            align-items: center;
          }

          h3 {
            flex: 1;
          }

          .divider {
            width: 100%;
            border-bottom: 1px solid ${theme.border};
            padding-bottom: 0.5em;
            margin-bottom: 0.5em;
          }

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
