import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../../../../styles/theme'

import Notification from '../../../../../notification'

import CreateNumero from './create-numero'

class EmptyVoiesList extends React.Component {
  state = {
    numeroComplet: '',
    position: null,
    error: null
  }

  static propTypes = {
    addNumero: PropTypes.func.isRequired,
    bounds: PropTypes.object
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
    const {addNumero} = this.props
    let error = null

    try {
      if (numeroComplet === '') {
        throw new Error('Indiquez le numéro complet.')
      }

      if (!position) {
        throw new Error('Indiquez l’emplacement du numéro sur la carte.')
      }

      await addNumero({
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
      error
    })
  }

  render() {
    const {numeroComplet, position, error} = this.state
    const {bounds} = this.props

    return (
      <div>
        <div className='no-voie'>
          <div>
            <h4>Aucun numéro</h4>
            <Notification type='info'>
              Entrez le numéro complet que vous souhaitez ajouter à la voie.
            </Notification>
          </div>

          <CreateNumero
            input={numeroComplet}
            bounds={bounds}
            position={position}
            handleInput={this.handleInput}
            handlePosition={this.handlePosition}
            handleSubmit={this.addNumero}
            error={error}
          />
        </div>

        <style jsx>{`
          .no-voie {
            display: flex;
            flex-direction: column;
            border: 2px dashed ${theme.border};
            padding: 1em;
          }
      `}</style>
      </div>
    )
  }
}

export default EmptyVoiesList
