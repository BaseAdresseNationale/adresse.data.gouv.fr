import React from 'react'
import PropTypes from 'prop-types'
import FaPlus from 'react-icons/lib/fa/plus'

import Button from '../../../../../button'
import Notification from '../../../../../notification'
import PreventedDefaultForm from '../../prevented-default-form'

class CreateVoie extends React.Component {
  static propTypes = {
    input: PropTypes.string,
    error: PropTypes.instanceOf(Error),
    handleInput: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired
  }

  static defaultProps = {
    input: '',
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
    const {input, error, handleSubmit} = this.props

    return (
      <div>

        <PreventedDefaultForm onSubmit={handleSubmit}>
          <label>Nom</label>

          <div className='flex'>
            <input
              ref={input => {
                this.nameInput = input
              }}
              type='text'
              placeholder='Avenue Victor Hugo'
              value={input}
              onChange={this.handleInput}
            />

            <Button
              type='submit'
              size='small'
              style={{
                marginLeft: '1em',
                padding: '0.8em'
              }}
              onClick={handleSubmit}
            >
              <FaPlus />
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
          h4 {
            margin-bottom: 0.5em;
          }

          .flex {
            display: flex;
          }
        `}</style>
      </div>
    )
  }
}

export default CreateVoie
