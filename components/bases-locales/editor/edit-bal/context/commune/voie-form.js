import React from 'react'
import PropTypes from 'prop-types'

import {getName} from '../../../../../../lib/bal/item'

import Button from '../../../../../button'
import Notification from '../../../../../notification'
import PreventedDefaultForm from '../../../../../prevented-default-form'

class VoieForm extends React.Component {
  static propTypes = {
    voie: PropTypes.object,
    input: PropTypes.string,
    error: PropTypes.instanceOf(Error),
    handleInput: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    deleteVoie: PropTypes.func,
    cancelChange: PropTypes.func
  }

  static defaultProps = {
    voie: null,
    input: '',
    deleteVoie: null,
    cancelChange: null,
    error: null
  }

  componentDidMount() {
    this.nameInput.focus()
  }

  handleInput = event => {
    const {handleInput} = this.props
    handleInput(event.target.value)
  }

  render() {
    const {input, error, voie, submit, deleteVoie, cancelChange} = this.props

    return (
      <PreventedDefaultForm onSubmit={submit}>
        <div className='voie-form'>

          <div>
            <label>Nom</label>
            <input
              ref={input => {
                this.nameInput = input
              }}
              type='text'
              placeholder={voie ? getName(voie) : 'Avenue Victor Hugo'}
              value={input}
              onChange={this.handleInput}
            />
          </div>

          {error && (
            <Notification
              style={{marginTop: '1em'}}
              type='error'
            >
              {error.message}
            </Notification>
          )}

          <div className='buttons'>
            <div className='button'>
              <Button onClick={submit}>
              Enregistrer
              </Button>
            </div>

            <div className='button'>
              <Button
                color='red'
                onClick={deleteVoie}
              >
              Supprimer
              </Button>
            </div>

            {cancelChange && (
              <div className='button'>
                <Button onClick={cancelChange}>
                Annuler les changements
                </Button>
              </div>
            )}
          </div>
        </div>

        <style jsx>{`
          .buttons {
            display: flex;
            flex-flow: wrap;
            align-items: center;
            margin: 0.2em;
          }

          .buttons .button {
            margin: 0.2em auto;
            padding: 0.1em;
          }
        `}</style>
      </PreventedDefaultForm>
    )
  }
}

export default VoieForm
