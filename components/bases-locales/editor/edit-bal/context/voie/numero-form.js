import React from 'react'
import PropTypes from 'prop-types'

import Button from '../../../../../button'
import Notification from '../../../../../notification'

import CreateNumeroMap from './edit-numero-map'

const positionToGeoJson = (numero, position) => {
  if (position && position.coords) {
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: position.coords
          },
          properties: {
            id: numero.id,
            numero: numero.numeroComplet
          }
        }
      ]
    }
  }

  return null
}

class NumeroForm extends React.Component {
  static propTypes = {
    numero: PropTypes.shape({
      numeroComplet: PropTypes.string.isRequired,
      edited: PropTypes.bool,
      modified: PropTypes.object,
      deleted: PropTypes.bool
    }).isRequired,
    position: PropTypes.object,
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
    handlePosition({coords: [coords.lng, coords.lat]})
  }

  render() {
    const {numero, position, updateNumero, deleteNumero, cancelChange, error} = this.props
    const origalPos = positionToGeoJson(numero, numero.positions[0])
    const newPos = position ? positionToGeoJson(numero, position) : null

    return (
      <div>
        <div className='map'>
          <Notification type='info'>
            Faites glisser la carte pour indiquer la nouvelle position du numéro.
          </Notification>

          <CreateNumeroMap
            data={origalPos}
            position={newPos}
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
