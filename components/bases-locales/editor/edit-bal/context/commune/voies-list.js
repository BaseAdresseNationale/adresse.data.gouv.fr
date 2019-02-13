import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../../../../styles/theme'

import Notification from '../../../../../notification'

import CreateItemWrapper from '../../create-item-wrapper'

import VoieItem from './voie-item'
import CreateVoie from './create-voie'

class VoiesList extends React.Component {
  state = {
    nomVoie: '',
    displayVoieForm: false,
    displayToponymeForm: false,
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
    const {nomVoie, position, displayToponymeForm, displayVoieForm} = this.state
    const {actions} = this.props
    let error = null

    try {
      if (!nomVoie) {
        throw new Error('Indiquez le nom.')
      }

      if (displayToponymeForm && !position) {
        throw new Error('Indiquez l’emplacement du toponyme sur la carte.')
      }

      await actions.addItem({nomVoie, position})
    } catch (err) {
      error = err
    }

    this.setState({
      nomVoie: error ? nomVoie : '',
      position: error ? position : null,
      displayVoieForm: displayToponymeForm ? false : Boolean(error),
      displayToponymeForm: displayVoieForm ? false : Boolean(error),
      error
    })
  }

  toggleVoieForm = () => {
    this.setState(state => {
      return {
        displayVoieForm: !state.displayVoieForm,
        nomVoie: '',
        position: null
      }
    })
  }

  render() {
    const {nomVoie, displayVoieForm, displayToponymeForm, error} = this.state
    const {codeCommune, voies, actions} = this.props

    return (
      <div className='voies-list'>
        <div>
          <div className='title'>
            <h3>Liste des voies</h3>
          </div>

          <div className='divider' />
        </div>

        {!displayToponymeForm && (
          <div>
            <CreateItemWrapper
              title='Création d’une voie'
              buttonText='Ajouter une voie'
              displayForm={displayVoieForm}
              toggleForm={this.toggleVoieForm}
            >
              <div className='form'>
                <CreateVoie
                  input={nomVoie}
                  handleInput={this.handleInput}
                  handleSubmit={this.addVoie}
                  error={error}
                />

                <Notification type='info'>
                  Vous pouvez également créer un toponyme directement depuis la carte en effectuant un clique droit.
                </Notification>
              </div>
            </CreateItemWrapper>
          </div>
        )}

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

          .form {
            display: grid;
            grid-template-columns: 1fr;
            grid-row-gap: 0.5em;
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
