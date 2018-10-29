import React from 'react'
import PropTypes from 'prop-types'

import Button from '../../../../../button'
import Notification from '../../../../../notification'

import PreventedDefaultForm from '../../prevented-default-form'

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
        <div>
          <label>Nom</label>
          <input
            ref={input => {
              this.nameInput = input
            }}
            type='text'
            placeholder={voie ? voie.nomVoie : 'Avenue Victor Hugo'}
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
          <Button
            color='red'
            onClick={deleteVoie}
          >
            Supprimer
          </Button>

          {cancelChange && (
            <Button onClick={cancelChange}>
              Annuler les changements
            </Button>
          )}

          <Button onClick={submit}>
            Enregistrer
          </Button>
        </div>

        <style jsx>{`
          .buttons {
            display: flex;
            justify-content: space-between;
            margin: 1em 0;
          }
        `}</style>
      </PreventedDefaultForm>
    )
  }
}

export default VoieForm
