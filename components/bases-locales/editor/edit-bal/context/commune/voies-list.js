import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../../../../styles/theme'

import CreateItemWrapper from '../../create-item-wrapper'

import VoieItem from './voie-item'
import CreateVoie from './create-voie'
import CreateToponyme from './create-toponyme'

class VoiesList extends React.Component {
  state = {
    nomVoie: '',
    position: null,
    displayVoieForm: false,
    displayToponymeForm: false,
    error: null
  }

  static propTypes = {
    codeCommune: PropTypes.string.isRequired,
    voies: PropTypes.object.isRequired,
    bounds: PropTypes.object,
    actions: PropTypes.object.isRequired
  }

  static defaultProps = {
    bounds: null
  }

  handleInput = input => {
    this.setState({
      nomVoie: input,
      error: null
    })
  }

  handlePosition = position => {
    console.log('TCL: VoiesList -> position', position);
    this.setState({
      position,
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

  toggleToponymeForm = () => {
    this.setState(state => {
      return {
        displayToponymeForm: !state.displayToponymeForm,
        nomVoie: '',
        position: null
      }
    })
  }

  render() {
    const {nomVoie, position, displayVoieForm, displayToponymeForm, error} = this.state
    const {codeCommune, voies, bounds, actions} = this.props

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

        <div className={`forms ${displayVoieForm === displayToponymeForm ? '' : 'open'}`}>
          {!displayToponymeForm && (
            <div>
              <CreateItemWrapper
                title='Création d’une voie'
                buttonText='Ajouter une voie'
                displayForm={displayVoieForm}
                toggleForm={this.toggleVoieForm}
              >
                <CreateVoie
                  input={nomVoie}
                  handleInput={this.handleInput}
                  handleSubmit={this.addVoie}
                  error={error}
                />
              </CreateItemWrapper>
            </div>
          )}

          {!displayVoieForm && (
            <div>
              <CreateItemWrapper
                title='Création d’un toponyme'
                buttonText='Ajouter un toponyme'
                displayForm={displayToponymeForm}
                toggleForm={this.toggleToponymeForm}
              >
                <CreateToponyme
                  input={nomVoie}
                  position={position}
                  bounds={bounds}
                  handleInput={this.handleInput}
                  handlePosition={this.handlePosition}
                  handleSubmit={this.addVoie}
                  error={error}
                />
              </CreateItemWrapper>
            </div>
          )}
        </div>

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

          .forms {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-column-gap: 1em;
          }

          .forms.open {
            grid-template-columns: repeat(1, 1fr);
          }

          .list {
            margin: 0.5em 0;
          }

          @media (max-width: 700px) {
            .forms {
              grid-template-columns: repeat(1, 1fr);
            }
          }
        `}</style>
      </div>
    )
  }
}

export default VoiesList
