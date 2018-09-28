import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../../../../styles/theme'

import CreateItemWrapper from '../../create-item-wrapper'

import NumeroItem from './numero-item'
import CreateNumero from './create-numero'

class NumerosList extends React.Component {
  state = {
    numeroComplet: '',
    position: null,
    displayForm: false,
    error: null
  }

  static propTypes = {
    codeCommune: PropTypes.string.isRequired,
    codeVoie: PropTypes.string.isRequired,
    numeros: PropTypes.object.isRequired,
    bounds: PropTypes.object,
    actions: PropTypes.shape({
      addItem: PropTypes.func.isRequired,
      select: PropTypes.func.isRequired
    }).isRequired
  }

  static defaultProps = {
    bounds: null
  }

  handleInput = input => {
    this.setState({
      numeroComplet: input,
      error: null
    })
  }

  handlePosition = position => {
    this.setState({
      position,
      error: null
    })
  }

  addNumero = async () => {
    const {numeroComplet, position} = this.state
    const {actions} = this.props
    let error = null

    try {
      if (numeroComplet === '') {
        throw new Error('Indiquez le numéro complet.')
      }

      if (!position) {
        throw new Error('Indiquez l’emplacement du numéro sur la carte.')
      }

      await actions.addItem({
        numeroComplet,
        positions: [{
          coords: position
        }]
      })
    } catch (err) {
      error = err
    }

    this.setState({
      numeroComplet: error ? numeroComplet : '',
      position: error ? position : null,
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
    const {numeroComplet, position, displayForm, error} = this.state
    const {codeCommune, codeVoie, numeros, bounds, actions} = this.props

    return (
      <div className='numeros-list'>
        <div className='title'>
          <h3>Liste des numéros</h3>
        </div>

        <div className='divider' />

        <CreateItemWrapper
          title='Création d’un nouveau numéro'
          buttonText='Ajouter un numéro'
          displayForm={displayForm}
          toggleForm={this.toggleForm}
        >
          {displayForm && (
            <CreateNumero
              input={numeroComplet}
              bounds={bounds}
              position={position}
              handleInput={this.handleInput}
              handlePosition={this.handlePosition}
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
          .title {
            display: flex;
            align-items: center;
          }

          .divider {
            width: 100%;
            border-bottom: 1px solid ${theme.border};
            padding-bottom: 0.5em;
            margin-bottom: 0.5em;
          }

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
