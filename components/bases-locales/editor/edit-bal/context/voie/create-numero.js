import React from 'react'
import PropTypes from 'prop-types'
import FaPlus from 'react-icons/lib/fa/plus'

import theme from '../../../../../../styles/theme'

import FormPreventDefault from '../../../../../form-prevent-default'
import Button from '../../../../../button'
import Notification from '../../../../../notification'

class CreateNumero extends React.Component {
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

  formPreventDefault(e) {
    const {handleSubmit} = this.props
    e.preventDefault()

    handleSubmit()
  }

  render() {
    const {input, error, handleSubmit} = this.props
    const nameInputRef = React.createRef()

    return (
      <div className='voie-form shadow-box'>
        <h3>Création d’un nouveau numéro</h3>

        <FormPreventDefault submit={handleSubmit} focusInput={nameInputRef}>
          <label>Numéro</label>

          <div className='flex'>
            <input
              ref={input => {
                this.nameInput = input
              }}
              type='text'
              placeholder='2bis'
              value={input}
              onChange={this.handleInput}
            />

            <Button
              type='submit'
              size='small'
              style={{
                margin: '0 1em',
                padding: '0.8em'
              }}
              onClick={handleSubmit}
            >
              <FaPlus />
            </Button>
          </div>
        </FormPreventDefault>

        {error && (
          <Notification
            style={{marginTop: '1em'}}
            type='error'
          >
            {error.message}
          </Notification>
        )}

        <style jsx>{`
            .shadow-box {
              border: 1px solid ${theme.border};
              box-shadow: 0 1px 4px 0 ${theme.boxShadow};
              padding: 1em;
            }

            .flex {
              display: flex;
            }
          `}</style>
      </div>
    )
  }
}

export default CreateNumero
