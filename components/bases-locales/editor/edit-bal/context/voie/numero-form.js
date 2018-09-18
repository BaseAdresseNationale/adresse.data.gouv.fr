import React from 'react'
import PropTypes from 'prop-types'

import Button from '../../../../../button'
import Notification from '../../../../../notification'

import CreateNumeroMap from './edit-numero-map'

const positionToGeoJson = (numero, position) => {
  if (position && position && position.coords) {
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
      modified: PropTypes.object,
      deleted: PropTypes.bool
    }).isRequired,
    handlePosition: PropTypes.func.isRequired,
    updateNumero: PropTypes.func.isRequired,
    cancelChange: PropTypes.func.isRequired,
    deleteNumero: PropTypes.func.isRequired,
    error: PropTypes.instanceOf(Error)
  }

  static defaultProps = {
    error: null
  }

  render() {
    const {numero, handlePosition, updateNumero, deleteNumero, cancelChange, error} = this.props
    const origalPos = positionToGeoJson(numero, numero.positions[0])
    const newPos = numero.modified ? positionToGeoJson(numero, numero.modified.positions[0]) : null

    return (
      <div>
        <div className='map'>
          <label>
            Faites glisser la carte pour indiquer la nouvelle position du numéro.
          </label>

          <CreateNumeroMap
            data={origalPos}
            position={newPos}
            handlePosition={handlePosition}
          />
        </div>

        {error && (
          <Notification type='error'>
            {error.message}
          </Notification>
        )}

        <div className='buttons'>
          <Button
            color='red'
            onClick={deleteNumero}
          >
            Supprimer
          </Button>

          {cancelChange && (
            <Button onClick={cancelChange}>
              Annuler les changements
            </Button>
          )}

          <Button onClick={updateNumero}>
            Enregistrer
          </Button>
        </div>

        <style jsx>{`
          .buttons {
            display: flex;
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
