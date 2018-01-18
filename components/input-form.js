import React from 'react'
import PropTypes from 'prop-types'

import Button from './button'
import Loader from './loader'

class Input extends React.PureComponent {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleSubmit(event) {
    const {value, onSubmit} = this.props
    event.preventDefault()
    onSubmit(value)
  }

  handleChange(event) {
    const {onChange} = this.props
    event.preventDefault()
    onChange(event.target.value)
  }

  render() {
    const {value, placeholder, buttonText, loading} = this.props

    return (
      <div className='form'>
        <input type='text' defaultValue={value} placeholder={placeholder} onChange={this.handleChange} />
        <Button type='submit' onClick={this.handleSubmit}>{loading ? <Loader /> : buttonText}</Button>
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

Input.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  loading: PropTypes.bool,
  buttonText: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}

Input.defaultProps = {
  value: null,
  placeholder: '',
  loading: false
}

export default Input
