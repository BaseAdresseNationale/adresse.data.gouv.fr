import React from 'react'
import PropTypes from 'prop-types'

import Button from '../../../../../button'
import Notification from '../../../../../notification'

import EditNumeroMap from './edit-numero-map'

class NumeroForm extends React.Component {
  static propTypes = {
    numero: PropTypes.shape({
      numeroComplet: PropTypes.string.isRequired,
      positions: PropTypes.array.isRequired,
      edited: PropTypes.bool,
      modified: PropTypes.object,
      deleted: PropTypes.bool
    }).isRequired,
    position: PropTypes.shape({
      coords: PropTypes.array
    }),
    handlePosition: PropTypes.func.isRequired,
    updateNumero: PropTypes.func,
    cancelChange: PropTypes.func.isRequired,
    deleteNumero: PropTypes.func.isRequired,
    error: PropTypes.instanceOf(Error)
  }

  static defaultProps = {
    position: null,
    updateNumero: null,
    error: null
  }

  handleCoords = coords => {
    const {handlePosition} = this.props
    handlePosition({coords})
  }

  render() {
    const {numero, position, updateNumero, deleteNumero, cancelChange, error} = this.props

    return (
      <div>
        <div className='map'>
          <Notification type='info'>
              Sélectionnez le marqueur puis déplacez-le à la position souhaitée.
          </Notification>

          <EditNumeroMap
            position={position ? position.coords : numero.positions[0].coords}
            handlePosition={this.handleCoords}
          />
        </div>

        {error && (
          <Notification type='error'>
            {error.message}
          </Notification>
        )}

        <div className='buttons'>
          {!numero.deleted && (
            <Button
              color='red'

              size='small'
              onClick={deleteNumero}
            >
              Supprimer ce numéro
            </Button>
          )}

          {(numero.edited || numero.deleted) && (
            <Button
              size='small'
              onClick={cancelChange}
            >
              Annuler les changements
            </Button>
          )}

          {updateNumero && (
            <Button
              size='small'
              onClick={updateNumero}
            >
              Enregistrer la nouvelle position
            </Button>
          )}
        </div>

        <style jsx>{`
          .buttons {
            display: flex;
            flex-flow: wrap;
            justify-content: space-between;
            align-items: center;
            margin: 1em;
          }
        `}</style>
      </div>
    )
  }
}

export default NumeroForm
