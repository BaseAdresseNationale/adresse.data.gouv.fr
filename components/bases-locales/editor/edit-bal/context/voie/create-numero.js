import React from 'react'
import PropTypes from 'prop-types'

import Notification from '../../../../../notification'
import Button from '../../../../../button'

import PreventedDefaultForm from '../../prevented-default-form'

import PositionsMap from './positions-map'

class CreateNumero extends React.Component {
  state = {
    input: '',
    positions: [],
    error: null
  }

  static propTypes = {
    bounds: PropTypes.object,
    onSubmit: PropTypes.func.isRequired
  }

  static defaultProps = {
    bounds: null
  }

  handleInput = e => {
    e.preventDefault()
    this.setState({input: e.target.value})
  }

  addPosition = feature => {
    this.setState(state => {
      const positions = [...state.positions]

      positions.push({
        id: feature.id,
        coords: feature.geometry.coordinates,
        type: 'entrée'
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
        if (position.id === feature.id) {
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
        if (position.id === feature.id) {
          positions[idx] = {...feature}
        }
      })

      return {
        positions
      }
    })
  }

  handleSubmit = async () => {
    const {input, positions} = this.state
    const {onSubmit} = this.props

    try {
      this.setState(async () => {
        await onSubmit({
          numeroComplet: input,
          positions
        })

        return this.initialState
      })
    } catch (err) {
      this.setState({
        error: err
      })
    }
  }

  render() {
    const {input, positions, error} = this.state
    const {bounds} = this.props

    return (
      <div className='numero-form'>
        <PreventedDefaultForm onSubmit={this.handleSubmit}>
          <div className='input'>
            <label>Numéro</label>
            <input
              ref={input => {
                this.nameInput = input
              }}
              type='text'
              placeholder='2bis'
              value={input}
              onChange={this.handleInput}
            />
          </div>

          <div className='map'>
            <Notification type='info'>
              Indiquez les différentes positions du numéro.
            </Notification>

            <PositionsMap
              bounds={bounds}
              positions={positions}
              addPosition={this.addPosition}
              removePosition={this.removePosition}
              updatePosition={this.updatePosition}
            />
          </div>

          <div className='submit'>
            {input && (
              <Button onClick={this.handleSubmit}>
                Enregistrer
              </Button>
            )}
          </div>
        </PreventedDefaultForm>

        {error && (
          <Notification
            style={{marginTop: '1em'}}
            type='error'
          >
            {error.message}
          </Notification>
        )}

        <style jsx>{`
          .input {
            margin: 1em 0;
          }

          .map {
            margin: 1em 0;
          }

          .submit {
            display: flex;
            justify-content: center;
            margin: 1em 0;
          }
        `}</style>
      </div>
    )
  }
}

export default CreateNumero
