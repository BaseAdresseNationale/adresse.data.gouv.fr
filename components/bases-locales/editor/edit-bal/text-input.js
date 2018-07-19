import React from 'react'
import PropTypes from 'prop-types'

class TextInput extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    input: PropTypes.string,
    placeholder: PropTypes.string,
    handleChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    label: null,
    input: '',
    placeholder: ''
  }

  handleChange = event => {
    const {handleChange} = this.props
    event.preventDefault()

    handleChange(event.target.value)
  }

  render() {
    const {label, input, placeholder} = this.props

    return (
      <div className='form'>
        {label && (
          <label>{label}</label>
        )}
        <input type='text' placeholder={placeholder} value={input} onChange={this.handleChange} />
        <style jsx>{`
          .form {
            display: flex;
            width: 100%;
            align-items: center;
          }

          label {
            margin: 0 1em 0 0;
          }
        `}</style>
      </div>
    )
  }
}

export default TextInput
