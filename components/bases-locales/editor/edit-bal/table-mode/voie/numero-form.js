import React from 'react'
import PropTypes from 'prop-types'
import {isEqual} from 'lodash'

import Button from '../../../../../button'
import Notification from '../../../../../notification'
import Mapbox from '../../../../../mapbox'

import PositionsMap from './positions-map'

class NumeroForm extends React.Component {
  constructor(props) {
    super(props)
    const positions = props.numero.edited ? props.numero.modified.positions : props.numero.positions

    this.state = {
      positions: [...positions],
      error: null

    }
  }

  static propTypes = {
    numero: PropTypes.shape({
      numeroComplet: PropTypes.string.isRequired,
      positions: PropTypes.array.isRequired,
      edited: PropTypes.bool,
      modified: PropTypes.object,
      deleted: PropTypes.bool
    }).isRequired,
    bounds: PropTypes.object,
    actions: PropTypes.shape({
      deleteItem: PropTypes.func.isRequired,
      cancelChange: PropTypes.func.isRequired,
      updateNumero: PropTypes.func.isRequired
    }).isRequired
  }

  static defaultProps = {
    bounds: null
  }

  addPosition = feature => {
    this.setState(state => {
      const positions = [...state.positions]

      positions.push({
        _id: feature.id,
        coords: feature.geometry.coordinates,
        type: 'entrée',
        source: [],
        dateMAJ: null
      })

      return {
        positions
      }
    })
  }

  removePosition = feature => {
    this.setState(state => {
      const positions = [...state.positions]

      positions.forEach((position, idx) => {
        if (position._id === feature.id) {
          positions.splice(idx, 1)
        }
      })

      return {
        positions
      }
    })
  }

  updatePosition = feature => {
    this.setState(state => {
      const positions = [...state.positions]

      positions.forEach((position, idx) => {
        if (position._id === feature.id) {
          positions[idx] = {
            _id: feature.id,
            coords: feature.geometry.coordinates,
            type: feature.properties.type,
            source: [],
            dateMAJ: null
          }
        }
      })

      return {
        positions
      }
    })
  }

  delete = async () => {
    const {numero, actions} = this.props
    await actions.deleteItem(numero)
  }

  cancel = async () => {
    const {numero, actions} = this.props
    await actions.cancelChange(numero)

    this.setState({
      positions: numero.positions
    })
  }

  handleSubmit = async () => {
    const {positions} = this.state
    const {numero, actions} = this.props

    try {
      await actions.updateNumero(numero, {
        positions
      })
    } catch (error) {
      this.setState({error})
    }
  }

  render() {
    const {positions, error} = this.state
    const {numero, bounds} = this.props
    const numeroPositions = numero.edited ? numero.modified.positions : numero.positions

    return (
      <div>
        <div className='map'>
          <Notification type='info'>
            Sélectionnez le marqueur puis déplacez-le à la position souhaitée.
          </Notification>

          <Mapbox ortho switchStyle>
            {map => (
              <PositionsMap
                map={map}
                positions={positions}
                bounds={bounds}
                addPosition={this.addPosition}
                removePosition={this.removePosition}
                updatePosition={this.updatePosition}
              />
            )}
          </Mapbox>

        </div>

        {error && (
          <div className='error'>
            <Notification type='error'>
              {error.message}
            </Notification>
          </div>
        )}

        <div className='buttons'>
          {!numero.deleted && (
            <Button
              color='red'
              size='small'
              onClick={this.delete}
            >
              Supprimer ce numéro
            </Button>
          )}

          {(numero.edited || numero.deleted) && (
            <Button
              size='small'
              onClick={this.cancel}
            >
              Annuler les changements
            </Button>
          )}

          {!isEqual(numeroPositions, positions) && (
            <Button
              size='small'
              onClick={this.handleSubmit}
            >
              Enregistrer
            </Button>
          )}
        </div>

        <style jsx>{`
          .map {
              margin-bottom: 4em;
          }

          .select-type {
            margin: 1em 0;
          }

          .error {
            margin: 1em 0;
          }

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
