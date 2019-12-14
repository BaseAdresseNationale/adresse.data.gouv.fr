import React from 'react'
import PropTypes from 'prop-types'

import Button from './button'
import Loader from './loader'

class Input extends React.PureComponent {
  static propTypes = {
    value: PropTypes.string,
    placeholder: PropTypes.string,
    isLoading: PropTypes.bool,
    buttonText: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  }

  static defaultProps = {
    value: null,
    placeholder: '',
    isLoading: false
  }

  handleSubmit = event => {
    const {value, onSubmit} = this.props

    event.preventDefault()
    onSubmit(value)
  }

  handleChange = event => {
    const {onChange} = this.props

    event.preventDefault()
    onChange(event.target.value)
  }

  render() {
    const {value, placeholder, buttonText, isLoading} = this.props

    return (
      <div className='form'>
        <input type='text' defaultValue={value} placeholder={placeholder} onChange={this.handleChange} />
        <Button type='submit' size='large' onClick={this.handleSubmit}>{isLoading ? <Loader /> : buttonText}</Button>
        <style jsx>{`
          .form {
            display: flex;
            align-items: center;
            width: 100%;
          }

          input {
            margin-right: 1em;
          }
          `}</style>
      </div>
    )
  }
}

export default Input
