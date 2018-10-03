import React from 'react'
import PropTypes from 'prop-types'
import FaClose from 'react-icons/lib/fa/close'

import Button from '../../../../../button'
import Notification from '../../../../../notification'

import PreventedDefaultForm from '../../prevented-default-form'

import CreateNumeroMap from './create-numero-map'

class CreateNumero extends React.Component {
  static propTypes = {
    input: PropTypes.string,
    type: PropTypes.string.isRequired,
    bounds: PropTypes.object,
    position: PropTypes.array,
    error: PropTypes.instanceOf(Error),
    handleInput: PropTypes.func.isRequired,
    handleSelect: PropTypes.func.isRequired,
    handlePosition: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired
  }

  static defaultProps = {
    input: '',
    bounds: null,
    position: null,
    error: null
  }

  componentDidUpdate(prevProps) {
    const {position} = this.props

    if (position && !prevProps.position) {
      this.nameInput.focus()
    }
  }

  handleInput = e => {
    const {handleInput} = this.props
    e.preventDefault()

    handleInput(e.target.value)
  }

  handlePosition = position => {
    const {handlePosition} = this.props
    handlePosition(position)
  }

  handleChange = e => {
    const {handleSelect} = this.props
    e.preventDefault()

    handleSelect(e.target.value)
  }

  handleSubmit = () => {
    const {handleSubmit} = this.props
    handleSubmit()
  }

  render() {
    const {input, type, bounds, position, error} = this.props

    return (
      <div className='numero-form'>
        <div className='map'>
          <Notification type='info'>
            Ajouter un marqueur à la position du numéro.
          </Notification>

          <CreateNumeroMap
            bounds={bounds}
            position={position}
            handlePosition={this.handlePosition}
          >
            {position && (
              <div>
                <div className='close' onClick={() => this.handlePosition(null)}>
                  <div className='close-button'>
                    <FaClose />
                  </div>
                </div>

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

                  <div className='select'>
                    <label>Type</label>
                    <select value={type} onChange={this.handleChange}>
                      <option value='entrée'>Entrée</option>
                      <option value='délivrance postale'>Délivrance postale</option>
                      <option value='bâtiment'>Bâtiment</option>
                      <option value='cage d’escalier'>Cage d’escalier</option>
                      <option value='logement'>Logement</option>
                      <option value='parcelle'>Parcelle</option>
                      <option value='segment'>Segment</option>
                      <option value='service technique'>Service technique</option>
                    </select>
                  </div>

                  <div className='submit'>
                    <Button type='submit' onClick={this.handleSubmit}>
                    Enregister
                    </Button>
                  </div>
                </PreventedDefaultForm>
              </div>
            )}
          </CreateNumeroMap>
        </div>

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

          .close {
            display: flex;
            justify-content: flex-end;
          }

          .close-button {
            padding: 0px 4px 4px 4px;
          }

          .close-button:hover {
            cursor: pointer;
            background: whitesmoke;
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
