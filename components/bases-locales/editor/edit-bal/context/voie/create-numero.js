import React from 'react'
import PropTypes from 'prop-types'

import Button from '../../../../../button'
import Notification from '../../../../../notification'

import PreventedDefaultForm from '../../prevented-default-form'

import CreateNumeroMap from './create-numero-map'

class CreateNumero extends React.Component {
  static propTypes = {
    input: PropTypes.string,
    contour: PropTypes.object,
    error: PropTypes.instanceOf(Error),
    handleInput: PropTypes.func.isRequired,
    handlePosition: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired
  }

  static defaultProps = {
    input: '',
    contour: null,
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
    const {input, contour, error, handlePosition, handleSubmit} = this.props

    return (
      <div className='voie-form'>
        <h3>Création d’un nouveau numéro</h3>

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
              Faites glisser la carte pour indiquer la position du numéro.
            </Notification>
            <CreateNumeroMap
              data={contour}
              handlePosition={handlePosition}
            />
          </div>

          <div className='submit'>
            <Button type='submit' onClick={handleSubmit}>
            Enregister
            </Button>
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
