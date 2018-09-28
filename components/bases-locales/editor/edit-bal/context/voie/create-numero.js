import React from 'react'
import PropTypes from 'prop-types'

import Button from '../../../../../button'
import Notification from '../../../../../notification'

import PreventedDefaultForm from '../../prevented-default-form'

import CreateNumeroMap from './create-numero-map'

class CreateNumero extends React.Component {
  static propTypes = {
    input: PropTypes.string,
    bounds: PropTypes.object,
    position: PropTypes.array,
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

  render() {
    const {input, bounds, position, error, handleSubmit, handlePosition} = this.props

    return (
      <div className='numero-form'>
        <PreventedDefaultForm onSubmit={handleSubmit}>
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
              Ajouter un marqueur à la position du numéro.
            </Notification>

            <CreateNumeroMap
              bounds={bounds}
              position={position}
              handlePosition={handlePosition}
            />
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

export default CreateNumero
