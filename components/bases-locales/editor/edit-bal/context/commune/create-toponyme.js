import React from 'react'
import PropTypes from 'prop-types'

import Button from '../../../../../button'
import Notification from '../../../../../notification'
import Mapbox from '../../../../../mapbox'

import PreventedDefaultForm from '../../prevented-default-form'

import SinglePositionMap from '../voie/single-position-map'

class CreateToponyme extends React.Component {
  static propTypes = {
    input: PropTypes.string,
    bounds: PropTypes.object,
    position: PropTypes.shape({
      coords: PropTypes.array
    }),
    error: PropTypes.instanceOf(Error),
    handleInput: PropTypes.func.isRequired,
    handlePosition: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired
  }

  static defaultProps = {
    input: '',
    bounds: null,
    position: null,
    error: null
  }

  componentDidMount() {
    this.nameInput.focus()
  }

  handleInput = e => {
    const {handleInput} = this.props
    e.preventDefault()

    handleInput(e.target.value)
  }

  handleCoords = coords => {
    const {handlePosition} = this.props

    handlePosition({
      coords,
      dateMAJ: null,
      source: [],
      type: 'entrée'
    })
  }

  render() {
    const {input, bounds, position, error, handleSubmit} = this.props

    return (
      <div className='toponyme-form'>
        <PreventedDefaultForm onSubmit={handleSubmit}>
          <div className='input'>
            <label>Nom</label>
            <input
              ref={input => {
                this.nameInput = input
              }}
              type='text'
              placeholder='Place du Moulin'
              value={input}
              onChange={this.handleInput}
            />
          </div>

          <div className='map'>
            <Notification type='info'>
              Ajouter un marqueur à la position du toponyme.
            </Notification>

            <Mapbox switchStyle>
              {map => (
                <SinglePositionMap
                  map={map}
                  bounds={bounds}
                  coords={position ? position.coords : null}
                  handlePosition={this.handleCoords}
                />
              )}
            </Mapbox>
          </div>

          <div className='submit'>
            {position && (
              <Button type='submit' onClick={handleSubmit}>
                Enregister
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
            margin-bottom: 4em;
          }

          .button-marker {
            display: flex;
            justify-content: center;
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

export default CreateToponyme
